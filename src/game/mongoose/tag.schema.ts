import { Game } from './game.schema';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

export type TagDocument = Tag & Document;

@Schema()
export class Tag {
  @Prop({ type: SchemaTypes.ObjectId, ref: Game.name, required: true })
  public game_id: Types.ObjectId;

  @Prop()
  public tag: string;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
