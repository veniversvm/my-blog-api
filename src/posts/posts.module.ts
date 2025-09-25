// src/posts/posts.module.ts (CORREGIDO)

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { UserEntity } from 'src/users/entities/user.entity';

// Entidades de este módulo
import { PostEntity } from './entities/post.entity';
import { CategoryEntity } from './entities/category.entity';

// Controladores de este módulo
import { PostsController } from './contollers/posts.controller';
import { CategoriesController } from './contollers/categories.controller';
// Servicios de este módulo
import { PostsService } from './services/posts.service';
import { CategoriesService } from './services/category.service';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([PostEntity, CategoryEntity, UserEntity])],
  controllers: [PostsController, CategoriesController],
  providers: [PostsService, CategoriesService],
})
export class PostsModule {}
