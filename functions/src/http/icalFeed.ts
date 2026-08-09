import { fetchDodgersGames } from "../mlb/mlbClient.js";
import { generateIcal } from "../ical/generateIcal.js";
import { onRequest } from "firebase-functions/v2/https";

export const icalFeed = onRequest(async (_request, response) => {
  const games = await fetchDodgersGames(2026);
  const ical = generateIcal(games);

  response.setHeader("Content-Type", "text/calendar; charset=utf-8");
  response.setHeader(
    "Cache-Control",
    "no-cache",
  );
  response.send(ical);
});
