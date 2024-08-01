import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFile
} from "@nestjs/common";
import { ReviewService } from './review.service';
import { reviewInterfaces } from '../interfaces/review.interfaces';
import { FileInterceptor } from "@nestjs/platform-express";
import { editFileName, imageFileFilter } from "../utils/file-upload";
import { diskStorage } from 'multer';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('/create')
  @UseInterceptors(
    FileInterceptor('sgf', {
      storage: diskStorage({
        destination: './uploads/review',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
      limits: {
        fileSize: 500000
      },
    }),
  )
  create(@Body() createReviewDto: reviewInterfaces, @UploadedFile() file) {
    console.log('server', createReviewDto)
    if(file) createReviewDto.sgf = `review/${file.filename}`;
    return this.reviewService.create(createReviewDto);
  }

  @Get(':id?')
  findAll(
    @Param('id') game_id: string,
    @Query('player_name') player_name: string,
    @Query('sort_date') sort_date: string,
    @Query('page') page: number,
  ) {
    return this.reviewService.findAllReview(
      game_id,
      page,
      player_name,
      sort_date,
    );
  }
}
