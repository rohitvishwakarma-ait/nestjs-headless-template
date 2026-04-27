import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { MetricsModule } from '../../../libs/monitoring/src/metrics.module';
import { DatabaseModule } from '../../../libs/database/src/database.module';
import { envValidationSchema } from './config/env.validation';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
      load: [databaseConfig],
    }),
    DatabaseModule,
    MetricsModule,
    UserModule,
    ProductModule,
  ],
})
export class AppModule {}
