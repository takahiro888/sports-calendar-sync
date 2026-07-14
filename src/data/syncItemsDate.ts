import type { SyncItem } from "@/types/sync";

export const initialSyncItems: SyncItem[] = [
  {
    id: "dodgers",
    title: "ドジャース 全試合日程",
    description: "公式戦の全スケジュール (10試合分)",
  },
  {
    id: "ohtani",
    title: "大谷 翔平 の出場予定テスト",
    description: "大谷選手が出場する見込みの試合 (10試合)",
    badge: "全試合会に所属",
    disabled: true,
  },
  {
    id: "yamamoto",
    title: "山本 由伸 の先発予定",
    description: "山本投手が先発登板する予定の試合 (3試合)",
    badge: "全試合会に所属",
    disabled: true,
  },
  {
    id: "sasaki",
    title: "佐々木 朗希 の先発予定",
    description: "現在、次の登板予定がないため 0試合",
  },
];
