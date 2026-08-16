import type { Game } from "@/features/subscription/api/mlbApi";
import { describe, it, expect } from "vitest";
import { buildSyncItemDescription } from "@/utils/syncItemBuilder";
import { initialSyncItems } from "@/data/syncItemsDate";

const OHTANI_ID = "660271";

const makeGame = (date: string, pitcherID?: string): Game => ({
  id: 1,
  date,
  time: "12:00",
  matchup: "ドジャース vs ヤンキース",
  location: "HOME",
  broadcast: "-",
  tag: "ドジャース全試合",
  probablePitcherID: pitcherID,
});

describe("buildSyncItemDescription", () => {
  it("dodgers: 今シーズンの全試合数がdescriptionに表示される", () => {
    const games = [makeGame("08/10"), makeGame("08/20")];
    const today = new Date("2024-08-16");

    const result = buildSyncItemDescription(initialSyncItems, games, today);
    const dodgers = result.find((item) => item.id === "dodgers");

    expect(dodgers?.description).toBe("今シーズン全2試合");
  });

  it("dodgers: 今後・過去の試合数が正しく計算される", () => {
    const games = [makeGame("08/10"), makeGame("08/20")];
    const today = new Date("2024-08-16");

    const result = buildSyncItemDescription(initialSyncItems, games, today);
    const dodgers = result.find((item) => item.id === "dodgers");

    expect(dodgers?.subDescription).toBe("(今後 1試合 / 過去 1試合)");
  });

  it("今日の試合は「今後」にカウントされる", () => {
    const games = [makeGame("08/16")];
    const today = new Date("2024-08-16");

    const result = buildSyncItemDescription(initialSyncItems, games, today);
    const dodgers = result.find((item) => item.id === "dodgers");

    expect(dodgers?.subDescription).toBe("(今後 1試合 / 過去 0試合)");
  });

  it("ゲームが0件のとき全カウントが0になる", () => {
    const today = new Date("2024-08-16");
    const result = buildSyncItemDescription(initialSyncItems, [], today);
    const dodgers = result.find((item) => item.id === "dodgers");

    expect(dodgers?.description).toBe("今シーズン全0試合");
    expect(dodgers?.subDescription).toBe("(今後 0試合 / 過去 0試合)");
  });

  it("ohtani: 大谷の先発試合数が独立して計算される", () => {
    const games = [makeGame("08/20", OHTANI_ID), makeGame("08/10")];
    const today = new Date("2024-08-16");

    const result = buildSyncItemDescription(initialSyncItems, games, today);
    const ohtani = result.find((item) => item.id === "ohtani");

    expect(ohtani?.description).toBe("今シーズンの先発登板1試合");
    expect(ohtani?.subDescription).toBe("(今後 1試合 / 過去 0試合)");
  });
});
