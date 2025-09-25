// src/posts/posts.service.ts

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostEntity } from '../entities/post.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { CategoryEntity } from '../entities/category.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CategoryEntity) // <-- ¡ASEGÚRATE DE INYECTARLO!
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  /**
   * Crea un nuevo post. Requiere el ID del autor.
   */
  async create(createPostDto: CreatePostDto): Promise<PostEntity> {
    // 1. Desestructuramos el DTO para separar los IDs de categorías del resto de los datos.
    const { categories: categoryIds, authorId, ...postData } = createPostDto;

    // 2. Buscamos al autor (esta lógica es insegura, pero la mantenemos por consistencia).
    const author = await this.userRepository.findOneBy({ id: authorId });
    if (!author) {
      throw new NotFoundException(`Usuario autor con ID '${authorId}' no encontrado.`);
    }

    // 3. Buscamos las entidades de las categorías correspondientes a los IDs.
    let categories: CategoryEntity[] = [];
    if (categoryIds && categoryIds.length > 0) {
      // Usamos el operador 'In' para buscar múltiples entidades por sus IDs de forma eficiente.
      categories = await this.categoryRepository.findBy({ id: In(categoryIds) });

      // (Opcional pero recomendado) Verificamos que todas las categorías enviadas existan.
      if (categories.length !== categoryIds.length) {
        throw new BadRequestException('Una o más de las categorías proporcionadas no existen.');
      }
    }

    // 4. Creamos la instancia del post con sus datos y el autor.
    const newPost = this.postRepository.create({
      ...postData,
      author: author,
      categories: categories, // 5. Asignamos el array de entidades de categorías.
    });

    // 6. Guardamos el post. TypeORM se encargará de crear las relaciones en la tabla pivote.
    return this.postRepository.save(newPost);
  }

  /**
   * Busca todo.
   */
  async findAll(): Promise<PostEntity[]> {
    return this.postRepository.find({
      relations: ['author', 'categories'], // Carga también las categorías
    });
  }

  /**
   * Busca un post por su ID.
   */
  async findOne(id: number): Promise<PostEntity> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException(`Post con ID '${id}' no encontrado.`);
    }
    return post;
  }

  /**
   * Actualiza un post usando el patrón 'preload'.
   */
  async update(id: number, updatePostDto: UpdatePostDto): Promise<PostEntity> {
    // Desestructuramos para manejar las categorías por separado.
    const { categories: categoryIds, ...postData } = updatePostDto;

    // Preload busca el post por ID y lo fusiona con los nuevos datos del DTO.
    const post = await this.postRepository.preload({
      id,
      ...postData,
    });

    if (!post) {
      throw new NotFoundException(`Post con ID '${id}' no encontrado para actualizar.`);
    }

    // Si se proporcionó un array de IDs de categorías, lo procesamos.
    if (categoryIds) {
      const categories = await this.categoryRepository.findBy({ id: In(categoryIds) });
      if (categories.length !== categoryIds.length) {
        throw new BadRequestException('Una o más de las categorías proporcionadas no existen.');
      }
      // Reemplazamos las categorías existentes con las nuevas.
      post.categories = categories;
    }

    return this.postRepository.save(post);
  }

  /**
   * Elimina un post por su ID.
   */
  async deletePost(id: number): Promise<void> {
    // Primero, nos aseguramos de que el post exista.
    const post = await this.findOne(id);

    // Si findOne no lanzó un error, procedemos a eliminar.
    await this.postRepository.remove(post);
  }
}
