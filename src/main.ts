import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from "fs";

const httpsOptions = process.env.TYPE === "DEVELOPMENT" ? {} : {
  key: fs.readFileSync('./secrets/localhost-key.pem'),
  cert: fs.readFileSync('./secrets/localhost.pem'),
};
async function bootstrap() {
  const app = process.env.TYPE === "DEVELOPMENT" ?
      await NestFactory.create(AppModule) :
      await NestFactory.create(AppModule, {httpsOptions});
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: ['http://localhost:8080','https://localhost:8080', 'https://87.228.16.152:8080',
      'http://87.228.16.152:8080', 'http://goloader.pro', 'https://goloader.pro:8080'],

    credentials: true,
    exposedHeaders: 'set-cookie'
  });

  await app.listen(process.env.PORT);
}
bootstrap();
