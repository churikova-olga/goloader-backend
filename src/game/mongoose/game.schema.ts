import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

export type GameDocument = Game & Document;

@Schema()
export class Game{
    @Prop()
    public name: string;

    @Prop()
    public created_at: string;

    @Prop()
    public player1_name: string;

    @Prop()
    public player1_rating: string;

    @Prop()
    public player2_name: string;

    @Prop()
    public player2_rating: string;

    @Prop()
    public sgf: string;

    @Prop()
    public game_link: string;

    @Prop({ required: true })
    public winner: string;

    @Prop()
    public description: string;


}

export const GameSchema = SchemaFactory.createForClass(Game);