// src/users/users.module.ts (CORREGIDO)

import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { ProfileEntity } from './entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ProfileEntity])],
  controllers: [UsersController],
  providers: [UsersService],
  // --- AÑADE ESTA LÍNEA ---
  // Esto hace que UsersService esté disponible para cualquier otro módulo
  // que importe UsersModule.
  exports: [UsersService],
})
export class UsersModule {}
