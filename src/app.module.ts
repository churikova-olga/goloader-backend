import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './game/game.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewModule } from "./review/review.module";
import { MulterModule } from "@nestjs/platform-express";


import { FilesModule } from './files/files.module';
console.log(__dirname);
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/GoLoader'),
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
