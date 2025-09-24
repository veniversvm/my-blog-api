import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { IUser } from './user.model';
import { CreateUserDto, UpdateUserDto } from './user.dto';

@Injectable()
export class UsersService {
  private users: IUser[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'email@email.com',
    },
    {
      id: '2',
      name: 'Jane Does',
      email: 'jane@email.com',
    },
  ];

  getAllUsers(): IUser[] {
    return this.users;
  }

  findUserById(id: string): IUser {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException(`Usuario con ID '${id}' no encontrado.`);
    }
    return user;
  }

  createUser(createUserDto: CreateUserDto): IUser {
    const emailExists = this.users.some((user) => user.email === createUserDto.email);

    if (emailExists) {
      throw new ConflictException(`El email '${createUserDto.email}' ya está en uso.`);
    }

    const lastId = this.users.length > 0 ? Number(this.users[this.users.length - 1].id) : 0;
    const newId = (lastId + 1).toString();

    const newUser: IUser = {
      id: newId,
      ...createUserDto,
    };

    this.users.push(newUser);

    return newUser;
  }

  updateUser(id: string, updateUserDto: UpdateUserDto): IUser {
    const user = this.findUserById(id);
    const updatedUser = { ...user, ...updateUserDto };

    this.users = this.users.map((u) => (u.id === id ? updatedUser : u));
    return updatedUser;
  }

  deleteUser(id: string): void {
    this.findUserById(id);

    this.users = this.users.filter((user) => user.id !== id);
  }
}
