import type { Game } from "@/features/subscription/api/mlbApi";
import type { SyncItem } from "@/types/sync";
import {
  OHTANI_MLB_ID,
  YAMAMOTO_MLB_ID,
  SASAKI_MLB_ID,
} from "@/constans/players";

const toDateStr = (date: Date): string => {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${mm}/${dd}`;
};

const splitByDate = (games: Game[], todayStr: string) => {
  const future = games.filter((g) => g.date >= todayStr).length;
  return {
    future,
    past: games.length - future,
  };
};

export const buildSyncItemDescription = (
  initialSyncItems: SyncItem[],
  games: Game[],
  today: Date,
) => {
  const todayStr = toDateStr(today);

  const dodgersCounts = splitByDate(games, todayStr);

  const ohtaniGames = games.filter(
    (g) => g.probablePitcherID === OHTANI_MLB_ID,
  );
  const ohtaniCounts = splitByDate(ohtaniGames, todayStr);

  const yamamotoGames = games.filter(
    (g) => g.probablePitcherID === YAMAMOTO_MLB_ID,
  );
  const yamamotoCounts = splitByDate(yamamotoGames, todayStr);

  const sasakiGames = games.filter(
    (g) => g.probablePitcherID === SASAKI_MLB_ID,
  );
  const sasakiCounts = splitByDate(sasakiGames, todayStr);

  return initialSyncItems.map((item) => {
    switch (item.id) {
      case "dodgers":
        return {
          ...item,
          description: `今シーズン全${games.length}試合`,
          subDescription: `(今後 ${dodgersCounts.future}試合 / 過去 ${dodgersCounts.past}試合)`,
        };
      case "ohtani":
        return {
          ...item,
          description: `今シーズンの先発登板${ohtaniGames.length}試合`,
          subDescription: `(今後 ${ohtaniCounts.future}試合 / 過去 ${ohtaniCounts.past}試合)`,
        };
      case "yamamoto":
        return {
          ...item,
          description: `今シーズンの先発登板${yamamotoGames.length}試合`,
          subDescription: `(今後 ${yamamotoCounts.future}試合 / 過去 ${yamamotoCounts.past}試合)`,
        };
      case "sasaki":
        return {
          ...item,
          description: `今シーズンの先発登板${sasakiGames.length}試合`,
          subDescription: `(今後 ${sasakiCounts.future}試合 / 過去 ${sasakiCounts.past}試合)`,
        };
      default:
        return item;
    }
  });
};
