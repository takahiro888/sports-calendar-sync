const DODGERS_TEAM_ID = 119;
const BASE_URL = "https://statsapi.mlb.com/api/v1";

// MLB API レスポンス型
type MLBPlayer = {
  id: number;
  fullName: string;
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

// アプリ内で使う型
export type Game = {
  id: number;
  date: string;
  time: string;
  matchup: string;
  location: "HOME" | "AWAY";
  broadcast: string;
  tag: string;
  probablePitcherID?: string;
};

function toGame(mlbGame: MLBGame): Game {
  const isHome = mlbGame.teams.home.team.id === DODGERS_TEAM_ID;
  const opponentName = (isHome ? mlbGame.teams.away : mlbGame.teams.home).team
    .name;
  const opponentNick = opponentName.split(" ").at(-1) ?? opponentName;

  const date = new Date(mlbGame.gameDate);
  const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Tokyo", // JSTに変換
  });
  const parts = Object.fromEntries(
    dateTimeFormat.formatToParts(date).map((part) => [part.type, part.value]),
  );

  //   broadcastsの構造は実際のレスポンスで確認して調整
  const broadcast =
    mlbGame.broadcasts?.find((broadcast) => broadcast.type === "TV")?.name ??
    "-";

  return {
    id: mlbGame.gamePk,
    date: `${parts.month}/${parts.day}`,
    time: `${parts.hour}:${parts.minute}`,
    matchup: `Dodgers vs ${opponentNick}`,
    location: isHome ? "HOME" : "AWAY",
    broadcast: broadcast,
    tag: "ドジャース全試合",
    probablePitcherID: (isHome
      ? mlbGame.teams.home
      : mlbGame.teams.away
    ).probablePitcher?.id.toString(),
  };
}

export async function fetchDodgerGames(season: number): Promise<Game[]> {
  const url = `${BASE_URL}/schedule?sportId=1&teamId=${DODGERS_TEAM_ID}&season=${season}&hydrate=probablePitcher,broadcasts`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch MLB schedule: ${response.statusText}`);
  }
  const data: MLBScheduleResponse = await response.json();
  return data.dates.flatMap((date) => date.games.map(toGame));
}
