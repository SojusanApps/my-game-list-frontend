import { UserType } from "./User";

export type GameReviewType = {
  id: number;
  score: number;
  created_at: Date;
  review: string;
  gameId: number;
  user: UserType;
};
