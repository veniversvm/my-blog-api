import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserPayload } from '../model/user-payload.model';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    // Opcional pero recomendado: configurar los nombres de los campos
    // que passport-local esperará en el body de la petición.
    super({ usernameField: 'username', passwordField: 'password' });
  }

  /**
   * Passport llama a este método automáticamente con las credenciales
   * del body de la petición (ej. 'username' y 'password').
   */
  async validate(username: string, password: string): Promise<UserPayload> {
    // console.log(`Validating user: ${username}`); // Útil para depuración

    // Llamamos a nuestro método 'validateUser' del AuthService
    const user = await this.authService.validateUser(username, password);

    // Si 'validateUser' devuelve null, significa que la autenticación falló.
    if (!user) {
      // Passport se encargará de convertir esta excepción en una respuesta 401 Unauthorized.
      throw new UnauthorizedException('Unauthorized');
    }

    // Si la autenticación es exitosa, Passport adjuntará el objeto 'user'
    // retornado aquí al objeto 'Request' (ej. req.user).
    return user;
  }
}
