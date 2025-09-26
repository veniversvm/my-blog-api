// auth.controller.ts
import { Controller, Post, Req, UseGuards, InternalServerErrorException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express'; // <-- Importa 'Request' directamente. Es más limpio.
import { AuthService } from './auth.service';
import { UserEntity } from 'src/users/entities/user.entity';
// import type { UserPayload } from './model/user-payload.model';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Req() req: Request) {
    // <-- Ya no necesitas usar 'express.Request'
    if (!req.user) {
      throw new InternalServerErrorException('No se encontró el usuario en la request después del login');
    }
    const user = req.user as UserEntity;
    return {
      user,
      access_token: this.authService.generateToken(user),
    };
  }
}
