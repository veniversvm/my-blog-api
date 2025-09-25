import { ConfigModuleOptions } from '@nestjs/config';
// import { configSchema } from './config.schema';
import { APP_CONFIG } from './config.loader';

export const configOptions: ConfigModuleOptions = {
  envFilePath: '.development.env',
  isGlobal: true,
  load: [APP_CONFIG],
  // validationSchema: configSchema,
};
