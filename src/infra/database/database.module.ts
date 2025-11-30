import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './database.config';

@Module({
  imports: [TypeOrmModule.forRootAsync({ useFactory: () => typeormConfig() })],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
