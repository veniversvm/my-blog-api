// src/posts/entities/post.entity.ts

import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { CategoryEntity } from './category.entity';

@Entity({ name: 'posts' })
export class PostEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 500, name: 'short_description', nullable: false })
  description: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  // --- NUEVO CAMPO ---
  @Column({ type: 'boolean', default: true, name: 'is_draft' })
  isDraft: boolean;

  // --- NUEVO CAMPO ---
  @Column({ type: 'text', nullable: true, name: 'cover_image' })
  coverImage: string;

  //* RELATIONS *//
  // Relación: Muchos posts pueden pertenecer a un usuario (autor)
  @ManyToOne(() => UserEntity, (user) => user.posts, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;

  @ManyToMany(() => CategoryEntity, (category) => category.posts)
  categories: CategoryEntity[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt: Date;

  // --- LÍNEA CORREGIDA Y COMPLETADA ---
  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
  updatedAt: Date;
}
