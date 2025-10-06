// src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Keep this import

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './core/database/database.module'; // Adjust path if needed
import { UsersModule } from './users/users.module';
import { configOptions } from './core/config.options';
import { PostsModule } from './posts/posts.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';

// 1. Import your custom config options

@Module({
  imports: [
    // 2. Use your custom options here
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    ConfigModule.forRoot(configOptions),
    CacheModule.register({ isGlobal: true, ttl: 60 * 5 }),
    UsersModule,
    DatabaseModule,
    PostsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
