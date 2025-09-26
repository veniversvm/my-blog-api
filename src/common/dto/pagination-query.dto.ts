import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsInt({ message: 'El límite debe ser un número entero.' })
  @IsPositive({ message: 'El límite debe ser un número positivo.' })
  @Type(() => Number)
  readonly limit: number = 10;

  @IsOptional()
  @IsInt({ message: 'La página debe ser un número entero.' })
  @Min(1, { message: 'La página debe ser como mínimo 1.' })
  @Type(() => Number)
  readonly page: number = 1;

  // --- NUEVO CAMPO PARA FILTRAR POR AUTOR ---
  @IsOptional()
  @IsInt({ message: 'El ID del autor debe ser un número entero.' })
  @IsPositive({ message: 'El ID del autor debe ser un número positivo.' })
  @Type(() => Number)
  readonly authorId?: number;

  // --- NUEVO CAMPO PARA FILTRAR POR CATEGORÍA ---
  @IsOptional()
  @IsInt({ message: 'El ID de la categoría debe ser un número entero.' })
  @IsPositive({ message: 'El ID de la categoría debe ser un número positivo.' })
  @Type(() => Number)
  readonly categoryId?: number;
}
