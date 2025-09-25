// src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Keep this import

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './core/database/database.module'; // Adjust path if needed
import { UsersModule } from './users/users.module';
import { configOptions } from './core/config.options';

// 1. Import your custom config options

@Module({
  imports: [
    // 2. Use your custom options here
    ConfigModule.forRoot(configOptions),
    UsersModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
