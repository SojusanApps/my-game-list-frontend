/** Tracks the Elo rating and match statistics for a single item in a pairwise ranking. */
export interface RankedItem {
  itemId: number;
  gameId: number;
  title: string;
  coverImageId?: string;
  rating: number;
  matchesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
}

/** The user's choice in a single duel. */
export type DuelChoice = "A" | "B" | "tie";

/** Records the result of a single head-to-head comparison. */
export interface DuelResult {
  itemAId: number;
  itemBId: number;
  choice: DuelChoice;
  timestamp: number;
}

/** The current pair of items being compared. */
export interface CurrentDuel {
  itemA: RankedItem;
  itemB: RankedItem;
}

/** Persistent ranking data for a single collection (Swiss Tournament format). */
export interface RankingProfile {
  collectionId: number;
  items: RankedItem[];
  duelHistory: DuelResult[];
  /** 1-indexed current round number. */
  currentRound: number;
  /** Total planned rounds (ceil(log₂(n))). May grow if user continues after completion. */
  totalRounds: number;
  /** Ordered [itemIdA, itemIdB] pairs to play in the current round. */
  roundPairings: Array<[number, number]>;
  /** Index into roundPairings of the next duel to present. */
  currentPairIndex: number;
  /** Canonical pair keys ("a-b" with a < b) of all pairs scheduled in any round (for dedup). */
  seenPairs: string[];
  /** Item IDs that received a bye in past rounds (rotated fairly for odd-n collections). */
  byeHistory: number[];
  createdAt: string;
  updatedAt: string;
}

/** Tracks which phase the ranking modal is in. */
export type RankingSessionState = "idle" | "dueling" | "results";

/** Progress information for the ranking session. */
export interface RankingProgress {
  duelsCompleted: number;
  /** Total duels across all planned rounds (floor(n/2) * totalRounds). */
  totalDuels: number;
  completionPercent: number;
  currentRound: number;
  totalRounds: number;
  /** 0-indexed position of the next duel within the current round. */
  duelInRound: number;
  /** Total duels in the current round (floor(n/2)). */
  duelsInRound: number;
}

/** Confidence level based on number of matches played. */
export type ConfidenceLevel = "low" | "medium" | "high";

/** Abstract storage adapter — can be swapped from localStorage to API later. */
export interface RankingStorageAdapter {
  load(collectionId: number): RankingProfile | null;
  save(collectionId: number, profile: RankingProfile): void;
  remove(collectionId: number): void;
}
