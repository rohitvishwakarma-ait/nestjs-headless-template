import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { MetricsModule } from '../../../libs/monitoring/src/metrics.module';
import { DatabaseModule } from '../../../libs/database/src/database.module';
import { envValidationSchema } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    DatabaseModule,
    MetricsModule,
    UserModule,
    ProductModule,
  ],
})
export class AppModule {}
