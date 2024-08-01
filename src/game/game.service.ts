import { Injectable, NotFoundException } from '@nestjs/common';
import { gameInterfaces } from "../interfaces/game.interfaces";
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Game, GameDocument } from './mongoose/game.schema';
import { TagService } from './tag/tag.service';
import { BASE_URL, DATA_PAGES } from "../config";
import { formatDate } from "../utils/parse_date";
import {readFileSync} from "fs";
import {join} from "path";

@Injectable()
export class GameService {
  constructor(
    @InjectModel(Game.name)
    private readonly GameModel: Model<GameDocument>,
    private readonly TagService: TagService,
  ) {}

  async create(createGameDto: gameInterfaces) {

    let tags = createGameDto.tags;
    if(typeof tags === 'string' && tags.length){
        tags = tags.split(' ');
    }
    let date = new Date();
    const data = {
      "name": createGameDto.name.length ? createGameDto.name : 'Партия',
      "created_at": formatDate(date),
      "player1_name": createGameDto.player1_name.length ? createGameDto.player1_name : 'Аноним',
      "player1_rating": createGameDto.player1_rating.length ?  createGameDto.player1_rating : 'неизвестнный',
      "player2_name": createGameDto.player2_name.length ? createGameDto.player2_name : 'Аноним',
      "player2_rating": createGameDto.player2_rating.length ? createGameDto.player2_rating : 'неизвестнный',
      "sgf": createGameDto.sgf || '',
      "game_link": createGameDto.game_link || '',
      "winner": createGameDto.winner, //required
      "description": createGameDto.description,
    }

    const newGame = await this.GameModel.create(data);
    if (!newGame) {
      throw new NotFoundException('Game not create');
    }

    const tagsArray = []
    for(let i = 0; i < tags.length; i++){
      const tagElem = {
        game_id: newGame._id,
        tag: tags[i]
      }
      tagsArray.push(tagElem);
    }
    const newTag = await this.TagService.createTag(tagsArray);
    if (!newTag) {
      throw new NotFoundException('Tag not create');
    }
    return newGame;
  }

  async findAllGame(page: number, player_name: string, player_rating: string, name: string, tag:string, sort_date: string|any ) {
    // пагинация сортировка от 1 до 20 первая страница и т.д.
    // player_name - фильтровать по имени игрока любого
    // player_rating - фильтровать по рейтингу игрока любого
    // name - фильтровать по названию партии
    // tag - фильтровать по тегу/тегам
    // created_at - сортировать по дате (по убыванию - desc (-1), по возрастанию - asc (1))
    const count = await this.GameModel.find().countDocuments().exec()


    let pages = (Number(page) || 1);
    pages = pages < 0 ? 1 : pages;

    let sorted = sort_date || -1;
    sorted = sorted === 'asc' ? 1 : -1;

    let skip = (pages - 1) * DATA_PAGES;
    let getGames, filterGamesId, filterTag, getTagsByGame, tagsArray: string[];
    let filter = {};

    if(player_name && player_rating && name) {
      filter = {
        $and: [
          {
            $or: [
              { player1_name: player_name },
              { player2_name: player_name }
            ]
          },
          {
            $or: [
              { player1_rating: player_rating},
              { player2_rating: player_rating }
            ]
          }
        ], name: name
      }
    }
    else if(player_name && player_rating) {
      filter = {
        $and: [
          {
            $or: [
              { player1_name: player_name },
              { player2_name: player_name }
            ]
          },
          {
            $or: [
              { player1_rating: player_rating },
              { player2_rating: player_rating }
            ]
          }
        ]
      }
    }
    else if(player_name && name) {
        filter = {
          $and: [
            {
              $or: [
                { player1_name: player_name },
                { player2_name: player_name }
              ]
            },
          ],
          name: name
        }
      }
    else if(player_rating && name) {
      filter = {
        $and: [
          {
            $or: [
              { player1_rating: player_rating },
              { player2_rating: player_rating }
            ]
          },
        ],
        name: name
      }
    }
    else if(player_name) {
      filter = {
        $and: [
          {
            $or: [
              { player1_name: player_name },
              { player2_name: player_name }
            ]
          },
        ]
      }
    }
    else if(player_rating) {
      filter = {
        $and: [
          {
            $or: [
              { player1_rating: player_rating },
              { player2_rating: player_rating }
            ]
          },
        ]
      }
    }
    else if(name) {
      filter = {
        name: name
      }
    }


    if(tag){
      tagsArray = tag.split(',');
      filterGamesId = await this.GameModel.find(filter).sort( {"_id" : sorted} ).distinct("_id").exec(); //выдать все игры для тегов
      filterTag = await this.TagService.findAllTagsFilter(filterGamesId, tagsArray);
      getGames = await this.GameModel.find({ _id: { $in: filterTag } }).skip(skip).limit(DATA_PAGES).exec();
    }
    else{
      getGames = await this.GameModel.find(filter).sort( {"_id" : sorted} ).skip(skip).limit(DATA_PAGES).exec(); // выдать 20 игр с фильтрами и сортировкой
    }

    if (!getGames) {
      throw new NotFoundException('Game not find');
    }


    const data = {
      info: {
        "count": count,
        "pages": Math.ceil(count/20),
        "next": `${BASE_URL}/api/game?page=${pages+1}`,
        "prev": pages > 1 ? `${BASE_URL}/api/game?page=${pages-1}` : null
      },
      results: []
    };

    for (let i = 0; i < getGames.length; i++) {
      const objectGame = {
        "id": getGames[i]._id,
        "name": getGames[i].name,
        "created_at":  getGames[i].created_at,
        "player1_name": getGames[i].player1_name,
        "player1_rating": getGames[i].player1_rating,
        "player2_name": getGames[i].player2_name,
        "player2_rating": getGames[i].player2_rating,
        "sgf": getGames[i].sgf,
        "game_link": getGames[i].game_link,
        "winner": getGames[i].winner,
        "description": getGames[i].description,
        "tags": []
      };
      getTagsByGame = await this.TagService.findAllTagsForGame(getGames[i]._id);
      objectGame.tags.push(...getTagsByGame);
      data.results.push(objectGame);
    }

    return data;
  }

  async findOne(id: string) {
    const game = await this.GameModel.findOne({'_id': id}).exec();
    const tags = await this.TagService.findAllTagsForGame(id);

    return  {
      "id": game._id,
      "name": game.name,
      "created_at":  game.created_at,
      "player1_name": game.player1_name,
      "player1_rating": game.player1_rating,
      "player2_name": game.player2_name,
      "player2_rating": game.player2_rating,
      "sgf": game.sgf,
      "game_link": game.game_link,
      "winner": game.winner,
      "description": game.description,
      "tags": tags
    };

  }
  imageBuffer(file, type) {
    return readFileSync(join(`./uploads/${type}`, file));
  }

}
