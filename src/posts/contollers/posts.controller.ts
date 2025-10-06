// src/posts/contollers/posts.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpCode, HttpStatus, Query, Req, UseGuards } from '@nestjs/common';
import { PostsService } from '../services/posts.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostEntity } from '../entities/post.entity';
import type { Request } from 'express';
// -- Propios -- //
import { PaginationResult } from 'src/common/interfaces/pagination-result.interface';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PostListItemDto } from '../dto/post-list-item.dto';
import { AuthGuard } from '@nestjs/passport';
import { Payload } from 'src/auth/model/user-payload.model';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createPostDto: CreatePostDto, @Req() req: Request): Promise<PostEntity> {
    // CORRECCIÓN: Llamar a 'create' en lugar de 'createPost'
    const payload = req.user as Payload;
    const userId = payload.sub;
    return this.postsService.create(createPostDto, userId);
  }

  @Get()
  findAll(
    @Query() paginationQuery: PaginationQueryDto, // <-- Inyectar el DTO de paginación
  ): Promise<PaginationResult<PostListItemDto>> {
    // <-- Actualizar el tipo de retorno
    return this.postsService.findAll(paginationQuery);
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
