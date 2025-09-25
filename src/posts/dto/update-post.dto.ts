// src/posts/dto/update-post.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';

/**
 * UpdatePostDto hereda todas las propiedades y validaciones de CreatePostDto,
 * pero las convierte en opcionales. Esto permite que el cliente envíe solo
 * los campos que desea actualizar.
 */
export class UpdatePostDto extends PartialType(CreatePostDto) {}
