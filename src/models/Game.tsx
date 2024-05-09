import { DeveloperType } from "./Developer";
import { PublisherType } from "./Publisher";
import { GenreType } from "./Genre";
import { PlatformType } from "./Platform";

export type GameType = {
  id: number;
  title: string;
  created_at: Date;
  last_modified_at: Date;
  release_date: Date;
  cover_image: string;
  description: string;
  publisher: PublisherType;
  developer: DeveloperType;
  platforms: PlatformType[];
  genres: GenreType[];
  average_score: number;
  scores_count: number;
  rank_position: number;
  members_count: number;
  popularity: number;
};
