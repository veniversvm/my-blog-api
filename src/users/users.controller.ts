import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import type { IUser } from './user.model';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/core/env.model';

@Controller('users')
export class UsersController {
  // Inyectamos nuestro servicio limpio
  constructor(
    private readonly usersService: UsersService,
    private readonly configServices: ConfigService<Env>, // inyecion de dependencias.
  ) {}

  @Get('/')
  getAllUsers(): IUser[] {
    const myVar: string | null = this.configServices.get('MYVAR', { infer: true }) ?? null;
    console.log(myVar);
    return this.usersService.getAllUsers();
  }

  @Get('/:id')
  getUserById(@Param('id') id: string): IUser {
    return this.usersService.findUserById(id);
  }

  @Post('/')
  createUser(@Body() createUserDto: CreateUserDto): IUser {
    return this.usersService.createUser(createUserDto);
  }

  @Put('/:id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): IUser {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT) // Para que devuelva 204 en éxito
  deleteUser(@Param('id') id: string): void {
    return this.usersService.deleteUser(id);
  }
}
