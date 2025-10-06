// src/auth/model/user-payload.model.ts
import { UserEntity } from 'src/users/entities/user.entity';

// Omitimos tanto la contraseña como el método para hashearla.
export type UserPayload = Omit<UserEntity, 'password' | 'hashPassword'>;

export interface Payload {
  sub: number;
}
