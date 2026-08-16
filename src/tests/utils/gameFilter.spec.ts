import type { Game } from "@/features/subscription/api/mlbApi";
import { filterGamesBySubscription } from "@/utils/gameFilters";
import { describe, it, expect } from "vitest";

// テストで使い回す最小限のゲームデータ
const makeGame = (overrides: Partial<Game> = {}): Game => ({
  id: 1,
  date: "08/16",
  time: "12:00",
  matchup: "ドジャース vs ヤンキース",
  location: "HOME",
  broadcast: "NHK",
  tag: "ドジャース全試合",
  ...overrides,
});

const OHTANI_ID = "660271";
const YAMAMOTO_ID = "808967";

describe("filterGamesBySubscription", () => {
  describe("dodgersを選択した場合", () => {
    it("全試合をそのまま返す", () => {
      const games = [makeGame({ id: 1 }), makeGame({ id: 2 })];
      expect(filterGamesBySubscription(games, "dodgers")).toEqual(games);
    });

    it("空配列を渡すと空配列を返す", () => {
      expect(filterGamesBySubscription([], "dodgers")).toEqual([]);
    });
  });

  describe("ohtaniを選択した場合", () => {
    it("大谷が先発の試合のみ返す", () => {
      const games = [
        makeGame({ id: 1, probablePitcherID: OHTANI_ID }),
        makeGame({ id: 2, probablePitcherID: YAMAMOTO_ID }),
      ];
      const result = filterGamesBySubscription(games, "ohtani");
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it('フィルター後の試合にtag "OHTANI"が付与される', () => {
      const games = [makeGame({ probablePitcherID: OHTANI_ID })];
      const result = filterGamesBySubscription(games, "ohtani");
      expect(result[0].tag).toBe("OHTANI");
    });

    it("大谷が1試合も先発しない場合は空配列を返す", () => {
      const games = [makeGame({ probablePitcherID: YAMAMOTO_ID })];
      expect(filterGamesBySubscription(games, "ohtani")).toEqual([]);
    });
  });

  describe("不明なIDを渡した場合", () => {
    it("空配列を返す", () => {
      const games = [makeGame()];
      expect(filterGamesBySubscription(games, "unknown_player")).toEqual([]);
    });
  });
});
