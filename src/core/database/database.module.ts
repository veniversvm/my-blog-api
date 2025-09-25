// database.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config'; // 1. Import ConfigModule
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_CONFIG, AppConfigType } from '../config.loader';
import { UserEntity } from 'src/users/entities/user.entity';
import { ProfileEntity } from 'src/users/entities/profile.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      // 2. Add ConfigModule to the imports array here
      imports: [ConfigModule],
      useFactory: (config: ConfigType<AppConfigType>) => {
        const { host, name, password, port, username } = config.db;
        // A small safety check for your factory
        if (!host || !name || !port || !username) {
          throw new Error('Database configuration is incomplete. Check your .env file.');
        }
        return {
          database: name,
          entities: [UserEntity, ProfileEntity],
          host,
          password,
          port,
          synchronize: true, // Be careful with this in production
          type: 'postgres',
          username,
        };
      },
      // 3. This part was already correct
      inject: [APP_CONFIG.KEY],
    }),
  ],
})
export class DatabaseModule {}
