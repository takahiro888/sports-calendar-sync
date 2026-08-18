import { Text, Box } from "@chakra-ui/react";
import { useSyncId } from "@/hooks/useSyncId";
import { useGames } from "@/hooks/useGames";
import { filterGamesBySubscription } from "@/utils/gameFilters";
import "./App.css";
import { SubscriptionPanel } from "@/features/subscription/components/SubscriptionPanel";
import { useState, useMemo } from "react";
import { initialSyncItems } from "@/data/syncItemsDate";
import { CalendarSyncModal } from "./features/subscription/components/CalendarSyncModal";
import type { SyncItem } from "./types/sync";
import { GamePreviewSection } from "./features/subscription/components/GamePreviewSection";
import { buildSyncItemDescription } from "./utils/syncItemBuilder";
import { CalendarSyncSection } from "./features/subscription/components/CalendarSyncSection";

function App() {
  const { games, isLoading } = useGames(2026);
  const syncId = useSyncId();
  const [syncModal, setSyncModal] = useState<"google" | "apple" | null>(null);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(
    new Set(["dodgers"]),
  );

  const handleCheckedChange = (id: string, checked: boolean) => {
    setCheckedIds(checked ? new Set([id]) : new Set());
  };

  // チェック状態に応じてゲームをフィルタリング
  const filteredGames = useMemo(
    () => filterGamesBySubscription(games, [...checkedIds][0] ?? ""),
    [games, checkedIds],
  );

  // チェック内容からiCal URLを決定
  const calendarUrl = useMemo(() => {
    const selected = initialSyncItems.find((item) => checkedIds.has(item.id));
    const base = selected?.icalUrl ?? "";
    return base ? `${base}?s=${syncId}` : "";
  }, [checkedIds, syncId]);

  // 動的なitemsを生成
  const syncItems = useMemo((): SyncItem[] => {
    if (isLoading)
      return initialSyncItems.map((item) => ({
        ...item,
        description: "取得中...",
      }));
    return buildSyncItemDescription(initialSyncItems, games, new Date());
  }, [games, isLoading]);

  const handleSync = (type: "google" | "apple") => {
    setSyncModal(type);
    window.gtag?.("event", "calendar_sync_started", {
      calendar_type: type,
      sync_target: [...checkedIds][0] ?? "none",
    });
  };

  return (
    <>
      <Box
        minH="100vh"
        bg="gray.900"
        display="flex"
        flexDirection="column"
        alignItems="center"
        pt={{ base: 8, md: 16 }}
        px={4}
      >
        <Text
          fontSize={{ base: "2xl", md: "3xl" }}
          fontWeight="bold"
          color="white"
          mb={4}
        >
          SportsCalendar{" "}
          <Text
            as="span"
            bgGradient="to-r"
            gradientFrom="purple.400"
            gradientTo="blue.400"
            bgClip="text"
          >
            Sync
          </Text>
        </Text>
        <Text
          fontSize="sm"
          color="whiteAlpha.700"
          textAlign="center"
          maxW="md"
          mb={2}
        >
          一度追加するだけで、ドジャース戦の日程や放送スケジュール、先発予定があなたのカレンダーに
          <Text as="span" fontWeight="bold">
            自動更新
          </Text>
          で同期され続けます
        </Text>
        <Box w="full" maxW="3xl">
          {/* Step 1: 同期対象選択 */}
          <SubscriptionPanel
            items={syncItems}
            checkedIds={checkedIds}
            onCheckedChange={handleCheckedChange}
          />
          {/* Step 2: 試合プレビュー */}
          <GamePreviewSection
            filteredGames={filteredGames}
            isLoading={isLoading}
          />
          {/* Step 3: デバイス選択 */}
          <CalendarSyncSection onSync={handleSync} />

          {/* フッター */}
          <Box textAlign="center" mt={10} mb={8} px={4}>
            <Text fontSize="xs" color="whiteAlpha.600">
              © 2026 SportsCalendar Sync. All rights reserved.
            </Text>
            <Text
              fontSize="xs"
              color="whiteAlpha.400"
              mt={2}
              maxW="md"
              mx="auto"
            >
              本サービスはオープンなプロトタイプ（MVP）であり、メジャーリーグベースボール（MLB）および選手会、各所属球団等とは提携・関係していません。
            </Text>
          </Box>
        </Box>
      </Box>

      {/* モーダル */}
      {syncModal && calendarUrl && (
        <CalendarSyncModal
          type={syncModal}
          calendarUrl={calendarUrl}
          onClose={() => setSyncModal(null)}
        />
      )}
    </>
  );
}

export default App;
