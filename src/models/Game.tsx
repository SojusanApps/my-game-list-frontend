import { CompanyType } from "./Company";
import { GenreType } from "./Genre";
import { PlatformType } from "./Platform";

export type GameType = {
  id: number;
  title: string;
  created_at: Date;
  last_modified_at: Date;
  release_date: Date;
  cover_image_id: string;
  summary: string;
  publisher: CompanyType;
  developer: CompanyType;
  platforms: PlatformType[];
  genres: GenreType[];
  igdb_id: number;
  average_score: number;
  scores_count: number;
  rank_position: number;
  members_count: number;
  popularity: number;
};
