import { Column, CreateDateColumn, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Entity } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
export class ProfileEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, name: 'last_name' })
  lastName: string;

  @Column('int')
  age: number;

  @Column({ type: 'text', name: 'avatar_url', nullable: true })
  avatarUrl: string;

  @OneToOne(() => UserEntity, (user) => user.profile, { nullable: false })
  @JoinColumn({ name: 'user_id' }) // <-- ¡Esto es crucial! Le dice a TypeORM que esta tabla tiene la clave foránea.
  user: UserEntity;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
  updatedAt: Date;
}
