import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { UserPayload } from './model/user-payload.model';
import { UserEntity } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // auth.service.ts
  async validateUser(username: string, pass: string): Promise<UserPayload | null> {
    const field = username.includes('@') ? 'email' : 'username';
    const user = await this.userService.findUserByNameOrEmail(field, username);

    // Si no hay usuario o si la contraseña no coincide, falla.
    // Usamos un 'guard clause' para salir temprano.
    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('Unauthorized'); // O puedes lanzar la excepción aquí si lo prefieres
    }

    // Si todo está bien, devuelve el usuario sin la contraseña.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  /////////////
  /////////////
  /////////////
  generateToken(user: UserEntity): string {
    const payload = { sub: user.id };
    return this.jwtService.sign(payload);
  }
}
