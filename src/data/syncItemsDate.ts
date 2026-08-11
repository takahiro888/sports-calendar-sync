import type { SyncItem } from "@/types/sync";

const BASE_URL = "https://sports-calendar-sync-9d780.web.app/ical";

export const initialSyncItems: SyncItem[] = [
  {
    id: "dodgers",
    title: "ドジャース 全試合日程",
    description: " ",
    badge: "チーム",
    icalUrl: `${BASE_URL}/dodgers.ics`,
  },
  {
    id: "ohtani",
    title: "大谷 翔平 の先発予定",
    description: "大谷選手が出場する見込みの試合 (10試合)",
    badge: "個人",
    icalUrl: `${BASE_URL}/ohtani.ics`,
  },
  {
    id: "yamamoto",
    title: "山本 由伸 の先発予定",
    description: "山本投手が先発登板する予定の試合 (3試合)",
    badge: "個人",
    icalUrl: `${BASE_URL}/yamamoto.ics`,
  },
  {
    id: "sasaki",
    title: "佐々木 朗希 の先発予定",
    description: "現在、次の登板予定がないため 0試合",
    badge: "個人",
    icalUrl: `${BASE_URL}/sasaki.ics`,
  },
];
