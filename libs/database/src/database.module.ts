import { Module } from '@nestjs/common';

// Handbook: centralized data layer — DB connection shared by APIs
// Replace TypeOrmModule / PrismaModule config here
@Module({
  imports: [
    // TypeOrmModule.forRootAsync({ ... }) or PrismaModule
  ],
  exports: [],
})
export class DatabaseModule {}
