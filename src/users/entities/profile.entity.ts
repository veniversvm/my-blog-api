import { Column, CreateDateColumn, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from './user.entity';

export class ProfileEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, name: 'last_name' })
  LastName: string;

  @Column('int')
  age: number;

  @Column({ type: 'text', length: 255, name: 'avatar_url' })
  avatarUrl: string;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
  updatedAt: Date;
}
