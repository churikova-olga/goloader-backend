import { Injectable } from '@nestjs/common';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BASE_URL, DATA_PAGES } from "../config";
import { reviewInterfaces } from "../interfaces/review.interfaces";
import { Review, ReviewDocument } from "./mongoose/review.schema";
import { formatDate } from "../utils/parse_date";

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name)
    private readonly ReviewModel: Model<ReviewDocument>,
  ) {}
  create(createReviewDto: reviewInterfaces) {
    const date = new Date();
    createReviewDto.player_name = createReviewDto.player_name.length ? createReviewDto.player_name : "Аноним"
    const review = new this.ReviewModel({ ...createReviewDto, created_at: formatDate(date) });
    return review.save();

  }

  async findAllReview(game_id: string, page: number, player_name: string, sort_date: string|any) {
    // пагинация сортировка от 1 до 20 первая страница и т.д.
    // player_name - фильтровать по имени игрока
    // created_at - сортировать по дате (по убыванию - desc (-1), по возрастанию - asc (1))
    const count = await this.ReviewModel.find({game_id: game_id}).countDocuments().exec()

    let pages = (Number(page) || 1);
    pages = pages < 0 ? 1 : pages;

    let sorted = sort_date || -1;
    sorted = sorted === 'asc' ? 1 : -1;

    let skip = (pages - 1) * DATA_PAGES;
    let getReviews;

    if(player_name){
      getReviews = await this.ReviewModel.find({game_id: game_id, player_name: player_name}).sort( {"created_at" : sorted} ).skip(skip).limit(DATA_PAGES).exec();
    }
    else{
      getReviews = await this.ReviewModel.find({game_id: game_id}).sort( {"created_at" : sorted} ).skip(skip).limit(DATA_PAGES).exec();
    }

    const data = {
      info: {
        "count": count,
        "pages": Math.ceil(count/20),
        "next": `${BASE_URL}/api/review?page=${pages+1}`,
        "prev": pages > 1 ? `${BASE_URL}/api/riview?page=${pages-1}` : null
      },
      results: getReviews
    };

    return data;
  }
}
