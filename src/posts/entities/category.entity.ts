// src/categories/entities/category.entity.ts

import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { PostEntity } from '../../posts/entities/post.entity'; // <-- Ajusta la ruta
import { UserEntity } from '../../users/entities/user.entity'; // <-- Ajusta la ruta

@Entity({ name: 'categories' })
export class CategoryEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  name: string;

  //* RELATIONS *//
  // Relación: Muchas categorías pueden tener muchos posts.
  @ManyToMany(() => PostEntity, (post) => post.categories)
  // @JoinTable es crucial para @ManyToMany. Define la tabla de unión.
  @JoinTable({
    name: 'posts_categories', // Nombre de la tabla pivote
    joinColumn: {
      name: 'category_id', // Nombre de la columna que referencia a esta entidad (CategoryEntity)
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'post_id', // Nombre de la columna que referencia a la otra entidad (PostEntity)
      referencedColumnName: 'id',
    },
  })
  posts: PostEntity[];

  // Relación: Muchas categorías pueden ser creadas por un usuario.
  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by_user_id' })
  createdBy: UserEntity;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
  updatedAt: Date;
}
