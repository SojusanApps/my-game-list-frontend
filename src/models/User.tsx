import { GameListType } from "./GameList";

type GameListStatistics = {
  completed: number;
  dropped: number;
  plan_to_play: number;
  on_hold: number;
  playing: number;
  total: number;
  mean_score: number;
};

type SimpleFriend = {
  id: number;
  gravatar_url: string;
};

export type UserType = {
  id: number;
  username: string;
  gender: string;
  last_login: Date;
  date_joined: Date;
  gravatar_url: string;
  game_list_statistics: GameListStatistics;
  friends: SimpleFriend[];
  latest_game_list_updates: GameListType[];
};
