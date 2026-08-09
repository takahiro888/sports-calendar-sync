import { ICalGame } from "../mlb/mlbClient.js";
import { escapeICalText } from "./escapeICalText.js";

function toICalDate(iso: string): string {
  return iso.replace(/[-:]/g, "").replace(/\.\d+$/, "");
}

function addHours(iso: string, hours: number): string {
  const date = new Date(iso);
  date.setUTCHours(date.getUTCHours() + hours);
  return date.toISOString();
}

export function generateIcal(games: ICalGame[]): string {
  const dtstamp = toICalDate(new Date().toISOString());

  const events = games
    .map((game) =>
      [
        "BEGIN:VEVENT",
        `UID:mlb-${game.gamePk}@sportscal-sync.com`,
        `DTSTAMP:${dtstamp}`,
        `DTSTART:${toICalDate(game.gameDate)}`,
        `DTEND:${toICalDate(addHours(game.gameDate, 3))}`,
        `SUMMARY:${escapeICalText(game.matchup)}`,
        `LOCATION:${escapeICalText(game.venue)}`,
        `DESCRIPTION:${escapeICalText(`放送: ${game.broadcast}`)}`,
        "END:VEVENT",
      ].join("\r\n"),
    )
    .join("\r\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//SportsCal Sync//MLB//JA",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:ドジャース 試合日程",
    "REFRESH-INTERVAL;VALUE=DURATION:PT6H",
    events,
    "END:VCALENDAR",
  ].join("\r\n");
}
