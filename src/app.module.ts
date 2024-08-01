import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './game/game.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewModule } from "./review/review.module";
import { MulterModule } from "@nestjs/platform-express";
import { ConfigModule } from '@nestjs/config';
import { FilesModule } from './files/files.module';

console.log(process.env.DATABASE_URL)
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    GameModule,
    ReviewModule,
    FilesModule,
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
