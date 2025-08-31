import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend (Vite default port 5173)
  app.enableCors({ origin: ['http://localhost:5173','http://127.0.0.1:5173'], credentials: true });

  // Enable global validation (DTOs)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: false }));

  // Enable serialization (to apply @Exclude and other transformers)
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(3000);
  console.log('Server running on http://localhost:3000');
}
bootstrap();
