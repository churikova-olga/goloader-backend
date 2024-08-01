import { Injectable, NotFoundException } from "@nestjs/common";

import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Tag, TagDocument } from '../mongoose/tag.schema';
import { tagInterfaces } from "../../interfaces/game.interfaces";

@Injectable()
export class TagService {
  constructor(
    @InjectModel(Tag.name)
    private readonly TagModel: Model<TagDocument>,
  ) {}
  async createTag(createTagDto: tagInterfaces[]) {
    return await this.TagModel.insertMany(createTagDto);
  }

  async findAllTagsForGame(game_id): Promise<TagDocument[]> {
    const result = await this.TagModel.find({ game_id: game_id }, { tag: 1 }).exec();
    if (!result) {
      throw new NotFoundException('Tag not find');
    }
    return result;
  }

  async findAllTagsFilter(game_id, tag) {
    return this.TagModel.find({
      game_id: { $in: game_id },
      tag: { $in: tag },
    })
      .distinct('game_id')
      .exec();
  }
}
