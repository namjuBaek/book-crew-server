// 환경변수 -> TypeORM 옵션 변환 (factory)
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function typeormConfig(): TypeOrmModuleOptions {
    return {
        type: 'mysql',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT ?? 3306),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        autoLoadEntities: true,
        synchronize: true, // dev 환경에서만 true
    };
}
