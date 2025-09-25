import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, createdByUserId: number): Promise<CategoryEntity> {
    const creator = await this.userRepository.findOneBy({ id: createdByUserId });
    if (!creator) {
      throw new NotFoundException(`Usuario creador con ID '${createdByUserId}' no encontrado.`);
    }

    const newCategory = this.categoryRepository.create({
      ...createCategoryDto,
      createdBy: creator,
    });

    return this.categoryRepository.save(newCategory);
  }

  async findAll(): Promise<CategoryEntity[]> {
    // Cargamos la relación para saber quién creó cada categoría
    return this.categoryRepository.find({
      relations: ['createdBy'],
    });
  }

  async findOne(id: number): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      // Al buscar una, es útil cargar también los posts asociados
      relations: ['createdBy', 'posts'],
    });

    if (!category) {
      throw new NotFoundException(`Categoría con ID '${id}' no encontrada.`);
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<CategoryEntity> {
    const category = await this.categoryRepository.preload({
      id,
      ...updateCategoryDto,
    });

    if (!category) {
      throw new NotFoundException(`Categoría con ID '${id}' no encontrada para actualizar.`);
    }

    return this.categoryRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }
}
