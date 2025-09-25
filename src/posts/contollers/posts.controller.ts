// src/posts/contollers/posts.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { PostsService } from '../services/posts.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostEntity } from '../entities/post.entity';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto): Promise<PostEntity> {
    // CORRECCIÓN: Llamar a 'create' en lugar de 'createPost'
    return this.postsService.create(createPostDto);
  }

  @Get()
  findAll(): Promise<PostEntity[]> {
    // CORRECCIÓN: Llamar a 'findAll' en lugar de 'findAllPosts'
    return this.postsService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PostEntity> {
    // Este ya estaba correcto
    return this.postsService.findOne(id);
  }

  @Patch('/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePostDto: UpdatePostDto): Promise<PostEntity> {
    // CORRECCIÓN: Llamar a 'update' en lugar de 'updatePost'
    return this.postsService.update(id, updatePostDto);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    // CORRECCIÓN: Renombraremos el método en el servicio para que coincida con 'remove'
    return this.postsService.deletePost(id);
  }
}
