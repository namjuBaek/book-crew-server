import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 보안 헤더 설정 (Helmet) - 개발 환경에서는 CSP 등을 완화
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
  }));

  // Cookie Parser 미들웨어 설정
  app.use(cookieParser());

  // CORS 설정
  app.enableCors({
    origin: process.env.NODE_ENV === 'production'
      ? ['https://yourdomain.com']
      : true, // 개발 환경: 모든 origin 허용 (단 credentials: true 시에는 구체적 origin이나 true로 동작하는지 확인 필요)
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // 쿠키 전송 허용
  });

  // 전역 ValidationPipe 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 정의되지 않은 속성 제거
      forbidNonWhitelisted: true, // DTO에 정의되지 않은 속성이 있으면 에러
      transform: true, // 요청 데이터를 DTO 인스턴스로 자동 변환
    }),
  );

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('Book Crew API')
    .setDescription('독서 모임 관리 플랫폼 API 문서')
    .setVersion('1.0')
    .addTag('users', '사용자 관리')
    .addTag('workspaces', '워크스페이스 관리')
    .addTag('books', '도서 관리')
    .addTag('meetings', '모임 관리')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'JWT 토큰을 입력하세요',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // 새로고침 시에도 인증 정보 유지
      tagsSorter: 'alpha', // 태그를 알파벳 순으로 정렬
      operationsSorter: 'alpha', // 작업을 알파벳 순으로 정렬
    },
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Server is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api`);
}
bootstrap();
