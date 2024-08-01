import {Schema, Prop, SchemaFactory} from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";
import { Game } from "../../game/mongoose/game.schema";

export type ReviewDocument = Review & Document;

@Schema()

export class Review{
    @Prop({ type: SchemaTypes.ObjectId, ref: Game.name, required: true })
    public game_id: Types.ObjectId;

    @Prop()
    public player_name: string;

    @Prop()
    public sgf: string;

    @Prop()
    public review_link: string;

    @Prop()
    public text: string;

    @Prop()
    public created_at: string;

}

export const ReviewSchema = SchemaFactory.createForClass(Review);