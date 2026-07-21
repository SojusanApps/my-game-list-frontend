import { GameListCompareResponse, GameListCompareRow } from "@/client";

export type CompareSectionKey = "common" | "firstUserUnique" | "secondUserUnique";

export interface CompareSection {
  key: CompareSectionKey;
  headingKey: string;
  count: number;
  rows: GameListCompareRow[];
}

export const buildCompareSections = (response: GameListCompareResponse): CompareSection[] => [
  {
    key: "common",
    headingKey: "compare.bothHave",
    count: response.common.length,
    rows: response.common,
  },
  {
    key: "firstUserUnique",
    headingKey: "compare.onlyFirstUser",
    count: response.first_user_unique.length,
    rows: response.first_user_unique,
  },
  {
    key: "secondUserUnique",
    headingKey: "compare.onlySecondUser",
    count: response.second_user_unique.length,
    rows: response.second_user_unique,
  },
];
