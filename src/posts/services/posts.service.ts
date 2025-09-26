// src/posts/posts.service.ts

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostEntity } from '../entities/post.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { CategoryEntity } from '../entities/category.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginationResult } from 'src/common/interfaces/pagination-result.interface';
import { PostListItemDto } from '../dto/post-list-item.dto';

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

  ///////////////
  ///////////////
  ///////////////
  //  METHODS  //
  ///////////////
  ///////////////
  ///////////////

  ///////////////
  //   POSTS   //
  ///////////////

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

  ///////////////
  ///////////////

  /**
   * Devuelve una lista paginada de posts.
   */
  async findAll(paginationQuery: PaginationQueryDto): Promise<PaginationResult<PostListItemDto>> {
    // Cambiamos el tipo de retorno a 'any' por ahora
    const { limit, page, authorId, categoryId } = paginationQuery;
    const skip = (page - 1) * limit;

    // 1. Empezamos a construir la consulta con el QueryBuilder
    const queryBuilder = this.postRepository.createQueryBuilder('post');

    // 2. Hacemos los JOINs necesarios para poder filtrar y seleccionar datos
    // Hacemos un JOIN con 'author' y luego con el 'profile' del autor para obtener el nombre
    queryBuilder.innerJoin('post.author', 'author');
    queryBuilder.innerJoin('author.profile', 'profile');
    // Hacemos un JOIN con las categorías para poder filtrar
    queryBuilder.innerJoin('post.categories', 'category');

    // 3. Aplicamos los filtros dinámicamente si se proporcionan
    if (authorId) {
      queryBuilder.andWhere('author.id = :authorId', { authorId });
    }

    if (categoryId) {
      // Filtramos los posts que tengan una categoría con el ID proporcionado
      queryBuilder.andWhere('category.id = :categoryId', { categoryId });
    }

    // 4. Seleccionamos los campos específicos que queremos devolver
    queryBuilder.select([
      'post.id as id',
      'post.title as title',
      'post.description as description',
      'post.createdAt as createdAt',
      `CONCAT(profile.name, ' ', profile.lastName) as "authorName"`, // <-- ¡Carga selectiva!
    ]);

    // 5. Aplicamos la paginación y el orden
    queryBuilder.skip(skip).take(limit).orderBy('post.createdAt', 'DESC');

    // 6. Ejecutamos la consulta para obtener los resultados y el conteo total
    const totalItems = await queryBuilder.getCount();
    const posts = await queryBuilder.getRawMany<PostListItemDto>(); // .getRawMany() devuelve un JSON plano

    // 7. Construimos la respuesta paginada
    const totalPages = Math.ceil(totalItems / limit);
    const meta = { totalItems, itemsPerPage: limit, totalPages, currentPage: page };

    return { data: posts, meta };
  }

  ///////////////
  ///////////////

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

  ///////////////
  ///////////////

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

  ///////////////
  ///////////////

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
