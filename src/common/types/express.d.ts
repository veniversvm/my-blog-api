// src/common/types/express.d.ts
import { UserPayload } from 'src/auth/model/user-payload.model';

declare global {
  namespace Express {
    interface Request {
      // Ahora TypeScript sabrá que 'user' en CUALQUIER objeto Request
      // en tu proyecto tiene este tipo.
      user: UserPayload;
    }
  }
}

// ¡ESTA LÍNEA ES LA SOLUCIÓN!
// Convierte este archivo en un módulo.
export {};
