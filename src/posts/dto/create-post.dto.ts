// src/posts/dto/create-post.dto.ts

import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class CreatePostDto {
  // ... (title, description, content, isDraft, coverImage sin cambios) ...

  @IsString({ message: 'El título debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El título no puede estar vacío.' })
  @MinLength(5, { message: 'El título debe tener al menos 5 caracteres.' })
  @MaxLength(255, { message: 'El título no puede tener más de 255 caracteres.' })
  readonly title: string;

  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La descripción no puede estar vacía.' })
  @MaxLength(500, { message: 'La descripción no puede tener más de 500 caracteres.' })
  readonly description: string;

  @IsString({ message: 'El contenido debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El contenido no puede estar vacío.' })
  readonly content: string;

  @IsOptional()
  @IsBoolean({ message: 'El estado de borrador debe ser un valor booleano (true/false).' })
  readonly isDraft?: boolean;

  @IsOptional()
  @IsUrl({}, { message: 'La imagen de portada debe ser una URL válida.' })
  readonly coverImage?: string;

  // --- CAMPO AÑADIDO ---
  // Ya no es necesario, esta en el token del usuario
  // @IsInt({ message: 'El ID del autor debe ser un número entero.' })
  // @IsNotEmpty({ message: 'El ID del autor no puede estar vacío.' })
  // readonly authorId: number;

  @IsArray({ message: 'El campo debe ser un Array de numeros' })
  @IsNumber({}, { each: true })
  @IsOptional()
  categories?: number[];
}
