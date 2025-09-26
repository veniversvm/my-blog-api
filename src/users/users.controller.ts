import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, ParseIntPipe, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dtos/user.dto';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/core/env.model';
import { UserEntity } from './entities/user.entity';
import { ProfileEntity } from './entities/profile.entity';
import { PaginationResult } from 'src/common/interfaces/pagination-result.interface';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('users')
export class UsersController {
  // Inyectamos nuestro servicio limpio
  constructor(
    private readonly usersService: UsersService,
    private readonly configServices: ConfigService<Env>, // inyecion de dependencias.
  ) {}

  @Get('/')
  async getAllUsers(@Query() paginationQuery: PaginationQueryDto): Promise<PaginationResult<UserEntity>> {
    return this.usersService.getAllUsers(paginationQuery);
  }
  @Get('/:id')
  async getUserById(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
    return this.usersService.findUserById(id);
  }

  @Post('/')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return await this.usersService.createUser(createUserDto);
  }

  @Put('/:id')
  async updateUser(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto): Promise<UserEntity> {
    return await this.usersService.updateUser(id, updateUserDto);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT) // Para que devuelva 204 en éxito
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.usersService.deleteUser(id);
  }

  @Get('/profile/:id')
  async getUserProfile(@Param('id', ParseIntPipe) id: number): Promise<ProfileEntity> {
    return this.usersService.findUserProfile(id);
  }
}
