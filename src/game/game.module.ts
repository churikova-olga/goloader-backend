import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from './mongoose/game.schema';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
    TagModule,
  ],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
