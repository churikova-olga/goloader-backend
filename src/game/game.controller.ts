import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { GameService } from './game.service';
import { gameInterfaces } from '../interfaces/game.interfaces';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { editFileName, imageFileFilter } from '../utils/file-upload';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('/create')
  @UseInterceptors(
    FileInterceptor('sgf', {
      storage: diskStorage({
        destination: './uploads/game',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  create(@Body() createGameDto: gameInterfaces, @UploadedFile() file) {
    if(file) createGameDto.sgf = `game/${file.filename}`;
    return this.gameService.create(createGameDto);
  }

  @Get('/?')
  // пагинация сортировка от 1 до 20 первая страница и т.д.
  // gamer_name - фильтровать по имени игрока
  // gamer_rating - фильтровать по рейтингу игрока
  // name - фильтровать по названию партии
  // tag - фильтровать по тегу/тегам
  // created_at - сортировать по дате (по убыванию - desc, по возрастанию - asc)
  findAll(
    @Query('page') page: number,
    @Query('player_name') player_name: string,
    @Query('player_rating') player_rating: string,
    @Query('name') name: string,
    @Query('tag') tag: string,
    @Query('sort_date') sort_date: string,
  ) {
    return this.gameService.findAllGame(
      page,
      player_name,
      player_rating,
      name,
      tag,
      sort_date,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gameService.findOne(id);
  }

  // @Get('/uploads/:file?')
  // uploads(@Param('file') image, @Res() res, @Query('type') type: string) {
  // // const response = res.sendFile(image, { root: `./uploads/${type}` });
  // // return {
  // //   status: HttpStatus.OK,
  // //   data: response,
  // // };
  //   const response = res.download(image, { root: `./uploads/${type}` });
  //   return {
  //     status: HttpStatus.OK,
  //     data: response,
  //   };
  // }

  @Get('/uploads/:file?')
  buffer(@Param('file') file, @Res() response: Response, @Query('type') type: string) {
    const result = this.gameService.imageBuffer(file, type);
    response.send(result);
  }
}