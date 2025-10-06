import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn, BeforeInsert } from 'typeorm';
import { ProfileEntity } from './profile.entity';
import { PostEntity } from '../../posts/entities/post.entity';
import { CategoryEntity } from '../../posts/entities/category.entity';
import * as bycypt from 'bcrypt';
import { Exclude } from 'class-transformer';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  username: string;

  @Exclude() // Another way tu not send the password, required more configurations
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  //* RELATIONS *//
  @OneToOne(() => ProfileEntity, (profile) => profile.user, { cascade: true })
  profile: ProfileEntity;

  @OneToMany(() => PostEntity, (post) => post.author)
  posts: PostEntity[];

  @OneToMany(() => CategoryEntity, (category) => category.createdBy)
  createdCategories: CategoryEntity[];

  // STAMPS //
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
  updatedAt: Date;

  // Password Hashing
  @BeforeInsert()
  async hashPassword() {
    this.password = await bycypt.hash(this.password, 10);
  }
}

//npm run migrations:generate ./src/core/database/migrations/init
