import { registerAs } from '@nestjs/config';

export const APP_CONFIG = registerAs('config', () => ({
  db: {
    name: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
  },
}));

export type AppConfigType = typeof APP_CONFIG;
