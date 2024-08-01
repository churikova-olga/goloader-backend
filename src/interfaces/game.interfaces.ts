export interface gameInterfaces {
  id?: string;
  name: string;
  created_at?: string;
  player1_name: string;
  player1_rating: string;
  player2_name: string;
  player2_rating: string;
  sgf?: string;
  game_link?: string;
  winner: string;
  description?: string;
  tags?: string | string[];
}

// export interface filterInterfaces {
//   player_name?: object;
//   name?: string;
//   player_rating?: object;
// }

export interface tagInterfaces {
  id?: string;
  game_id: string;
  tag: string;
}
