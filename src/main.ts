import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: ['http://localhost:8080', 'http://87.228.16.152:8080', 'http://goloader.pro', 'http://goloader.pro:8080', 'https://goloader.pro:8080'],
    credentials: true,
    exposedHeaders: 'set-cookie'
  });

  await app.listen(process.env.PORT);
}
bootstrap();
