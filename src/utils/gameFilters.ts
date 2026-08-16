import type { Game } from "@/features/subscription/api/mlbApi";
type PlayerFilterConfig = {
  playerId: string;
  tag: string;
};

const PLAYER_CONFIGS: Record<string, PlayerFilterConfig> = {
  ohtani: { playerId: "660271", tag: "OHTANI" },
  yamamoto: { playerId: "808967", tag: "YAMAMOTO" },
  sasaki: { playerId: "808963", tag: "SASAKI" },
};

export const filterGamesBySubscription = (games: Game[], checkedId: string) => {
  if (checkedId === "dodgers") return games;

  const config = PLAYER_CONFIGS[checkedId];
  if (!config) return [];

  return games
    .filter((game) => game.probablePitcherID === config.playerId)
    .map((game) => ({
      ...game,
      tag: config.tag,
    }));
};
