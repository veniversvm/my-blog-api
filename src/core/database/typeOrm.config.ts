import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config({ path: '.development.env' });
// ---------------------------------

if (!process.env.DB_HOST) {
  throw new Error('Las variables de entorno no se cargaron correctamente. Asegúrate de que el archivo .development.env existe.');
}

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'), // Simplificado: parseInt no necesita la base 10 aquí.
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['src/**/*.entity.ts'], // Mejor usar un patrón de glob para que no tengas que añadir cada entidad a mano.
  migrations: ['src/core/database/migrations/*.ts'],
  synchronize: false, // Correcto para migraciones
});
