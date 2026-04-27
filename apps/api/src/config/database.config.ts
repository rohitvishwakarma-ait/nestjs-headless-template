import { registerAs } from '@nestjs/config';

// Handbook: dedicated DB config — imported by DatabaseModule via ConfigService
export default registerAs('database', () => ({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  name: process.env.DB_NAME,
}));
