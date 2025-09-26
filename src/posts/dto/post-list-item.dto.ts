/* eslint-disable @typescript-eslint/no-unsafe-call */
// src/posts/dto/post-list-item.dto.ts
import { ApiProperty } from '@nestjs/swagger'; // Opcional, pero buena práctica para documentación

export class PostListItemDto {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly title: string;

  @ApiProperty()
  readonly description: string;

  @ApiProperty()
  readonly createdAt: Date;

  @ApiProperty()
  readonly authorName: string;
}
