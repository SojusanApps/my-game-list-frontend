import { describe, expect, it } from "vitest";
import { checkKeyParity } from "@/locales/checkKeyParity";

import enCommon from "@/locales/en/common.json";
import plCommon from "@/locales/pl/common.json";
import enAuth from "@/locales/en/auth.json";
import plAuth from "@/locales/pl/auth.json";
import enValidation from "@/locales/en/validation.json";
import plValidation from "@/locales/pl/validation.json";
import enAdmin from "@/locales/en/admin.json";
import plAdmin from "@/locales/pl/admin.json";
import enGames from "@/locales/en/games.json";
import plGames from "@/locales/pl/games.json";
import enCollections from "@/locales/en/collections.json";
import plCollections from "@/locales/pl/collections.json";
import enUsers from "@/locales/en/users.json";
import plUsers from "@/locales/pl/users.json";
import enNotifications from "@/locales/en/notifications.json";
import plNotifications from "@/locales/pl/notifications.json";
import enRanking from "@/locales/en/ranking.json";
import plRanking from "@/locales/pl/ranking.json";

const namespaces = [
  { name: "common", en: enCommon, pl: plCommon },
  { name: "auth", en: enAuth, pl: plAuth },
  { name: "validation", en: enValidation, pl: plValidation },
  { name: "admin", en: enAdmin, pl: plAdmin },
  { name: "games", en: enGames, pl: plGames },
  { name: "collections", en: enCollections, pl: plCollections },
  { name: "users", en: enUsers, pl: plUsers },
  { name: "notifications", en: enNotifications, pl: plNotifications },
  { name: "ranking", en: enRanking, pl: plRanking },
];

describe("keyParity", () => {
  it.each(namespaces)("$name: every EN key exists in PL", ({ en, pl }) => {
    expect(checkKeyParity(en, pl)).toEqual([]);
  });
});
