import { fetchDodgersGames, SASAKI_MLB_ID } from "../mlb/mlbClient.js";
import { generateIcal } from "../ical/generateIcal.js";
import { onRequest } from "firebase-functions/v2/https";

export const icalSasakiFeed = onRequest(async (_request, response) => {
  const games = await fetchDodgersGames(2026);
  const filtered = games.filter((game) => game.probablePitcherID === SASAKI_MLB_ID);
  const ical = generateIcal(filtered, "佐々木 朗希 先発予定");

  response.setHeader("Content-Type", "text/calendar; charset=utf-8");
  response.setHeader(
    "Cache-Control",
    "no-cache",
  );
  response.send(ical);
});
