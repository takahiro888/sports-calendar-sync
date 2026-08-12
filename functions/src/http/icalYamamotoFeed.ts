import { fetchDodgersGames, YAMAMOTO_MLB_ID } from "../mlb/mlbClient.js";
import { generateIcal } from "../ical/generateIcal.js";
import { onRequest } from "firebase-functions/v2/https";

export const icalYamamotoFeed = onRequest(
  { region: "asia-northeast1" },
  async (_request, response) => {
    const games = await fetchDodgersGames(2026);
    const filtered = games.filter(
      (game) => game.probablePitcherID === YAMAMOTO_MLB_ID,
    );
    const ical = generateIcal(filtered, "山本 由伸 先発予定", "00A550");

    response.setHeader("Content-Type", "text/calendar; charset=utf-8");
    response.setHeader("Cache-Control", "no-cache");
    response.send(ical);
  },
);
