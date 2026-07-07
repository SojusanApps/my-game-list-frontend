import { GameListStatusEnum } from "@/client";

/**
 * The minimal game shape both import flows work with. Satisfied by
 * `GameSimpleList` (Steam import, catalogue search) and `TitleImportMatch`
 * (title import candidates).
 */
export interface ImportedGame {
  id: number;
  title: string;
  cover_image_id?: string | null;
}

export interface GameRow {
  game: ImportedGame;
  status: GameListStatusEnum;
  score: number | null;
  owned_on: string[];
  started_at: Date | null;
  completed_at: Date | null;
  playtime: number | null;
  description: string;
}

/**
 * The user's decision for one imported title on the match step:
 * a chosen candidate, "none of these", or auto-set "no matches found".
 */
export type MatchDecision = { kind: "game"; game: ImportedGame } | { kind: "none" } | { kind: "no-matches" };

export function createGameRow(game: ImportedGame, ownedOn: string[] = []): GameRow {
  return {
    game,
    status: GameListStatusEnum.PTP,
    score: null,
    owned_on: ownedOn,
    started_at: null,
    completed_at: null,
    playtime: null,
    description: "",
  };
}
