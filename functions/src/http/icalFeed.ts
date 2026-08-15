import { fetchDodgersGames } from "../mlb/mlbClient.js";
import { generateIcal } from "../ical/generateIcal.js";
import { onRequest } from "firebase-functions/v2/https";

export const icalFeed = onRequest(
  { region: "asia-northeast1" },
  async (request, response) => {
    const syncId = (request.query.s as string) ?? "anonymous";
    const userAgent = request.headers["user-agent"] ?? "unknown";
    console.log(JSON.stringify({
      type: "ical_request", syncId, target: "dodgers",
      userAgent, timestamp: new Date().toISOString(),
    }));

    const games = await fetchDodgersGames(2026);
    const ical = generateIcal(games, "ドジャース 試合日程", "005A9C");

    response.setHeader("Content-Type", "text/calendar; charset=utf-8");
    response.setHeader("Cache-Control", "no-cache");
    response.send(ical);
  },
);
