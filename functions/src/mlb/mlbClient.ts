export const SASAKI_MLB_ID = "808963";
export const YAMAMOTO_MLB_ID = "808967";
export const OHTANI_MLB_ID = "660271";

const DODGERS_TEAM_ID = 119;
const BASE_URL = "https://statsapi.mlb.com/api/v1";

const TEAM_NAME_JA: Record<string, string> = {
  "Arizona Diamondbacks": "ダイヤモンドバックス",
  "Atlanta Braves": "ブレーブス",
  "Baltimore Orioles": "オリオールズ",
  "Boston Red Sox": "レッドソックス",
  "Chicago Cubs": "カブス",
  "Chicago White Sox": "ホワイトソックス",
  "Cincinnati Reds": "レッズ",
  "Cleveland Guardians": "ガーディアンズ",
  "Colorado Rockies": "ロッキーズ",
  "Detroit Tigers": "タイガース",
  "Houston Astros": "アストロズ",
  "Kansas City Royals": "ロイヤルズ",
  "Los Angeles Angels": "エンゼルス",
  "Miami Marlins": "マーリンズ",
  "Milwaukee Brewers": "ブルワーズ",
  "Minnesota Twins": "ツインズ",
  "New York Mets": "メッツ",
  "New York Yankees": "ヤンキース",
  "Oakland Athletics": "アスレチックス",
  "Philadelphia Phillies": "フィリーズ",
  "Pittsburgh Pirates": "パイレーツ",
  "San Diego Padres": "パドレス",
  "San Francisco Giants": "ジャイアンツ",
  "Seattle Mariners": "マリナーズ",
  "St. Louis Cardinals": "カージナルス",
  "Tampa Bay Rays": "レイズ",
  "Texas Rangers": "レンジャーズ",
  "Toronto Blue Jays": "ブルージェイズ",
  "Washington Nationals": "ナショナルズ",
};

// MLB API レスポンス型
type MLBPlayer = {
  id: number;
};
type MLBTeamEntry = {
  team: {
    id: number;
    name: string;
  };
  probablePitcher?: MLBPlayer;
};
type MLBGame = {
  gamePk: number;
  gameDate: string;
  teams: {
    away: MLBTeamEntry;
    home: MLBTeamEntry;
  };
  venue: {
    name: string;
  };
  broadcasts: {
    type: string;
    name: string;
  }[];
};
type MLBScheduleResponse = {
  dates: {
    date: string;
    games: MLBGame[];
  }[];
};

// ICS生成に使う型
export type ICalGame = {
  gamePk: number;
  gameDate: string;
  matchup: string;
  location: "HOME" | "AWAY";
  venue: string;
  broadcast: string;
  probablePitcherID?: string;
};

function toICalGame(mlbGame: MLBGame): ICalGame {
  const isHome = mlbGame.teams.home.team.id === DODGERS_TEAM_ID;
  const opponent = (isHome ? mlbGame.teams.away : mlbGame.teams.home).team;
  const opponentJa =
    TEAM_NAME_JA[opponent.name] ??
    opponent.name.split(" ").at(-1) ??
    opponent.name;
  const broadcast =
    mlbGame.broadcasts?.find((b) => b.type === "TV")?.name ?? "-";

  return {
    gamePk: mlbGame.gamePk,
    gameDate: mlbGame.gameDate,
    matchup: `ドジャース vs ${opponentJa}`,
    location: isHome ? "HOME" : "AWAY",
    venue: mlbGame.venue?.name ?? "",
    broadcast: broadcast,
    probablePitcherID: (isHome
      ? mlbGame.teams.home
      : mlbGame.teams.away
    ).probablePitcher?.id.toString(),
  };
}

export async function fetchDodgersGames(season: number): Promise<ICalGame[]> {
  const url = `${BASE_URL}/schedule?sportId=1&teamId=${DODGERS_TEAM_ID}&season=${season}&hydrate=probablePitcher,broadcasts,venue`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`MLB API error: ${response.statusText}`);
  }
  const data: MLBScheduleResponse = await response.json();
  return data.dates.flatMap((date) => date.games.map(toICalGame));
}
