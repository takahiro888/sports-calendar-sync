import { useState } from "react";

export const useSyncId = () => {
  // 1デバイス1IDをlocalStorageで永続化
  const [syncId] = useState(() => {
    const stored = localStorage.getItem("sportsCalSyncId");
    if (stored) return stored;
    const id = crypto.randomUUID();
    localStorage.setItem("sportsCalSyncId", id);
    return id;
  });
  return syncId;
};
