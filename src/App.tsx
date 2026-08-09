import { Text, Box, Badge, Spinner } from "@chakra-ui/react";
import "./App.css";
import { SubscriptionPanel } from "@/features/subscription/components/SubscriptionPanel";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { useState, useEffect, useMemo } from "react";
import {
  fetchDodgerGames,
  type Game,
  SASAKI_MLB_ID,
} from "@/features/subscription/api/mlbApi";
import { CalendarSyncModal } from "./features/subscription/components/CalendarSyncModal";

function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [gamesLoading, setGamesLoading] = useState<boolean>(true);
  const [syncModal, setSyncModal] = useState<"google" | "apple" | null>(null);

  useEffect(() => {
    fetchDodgerGames(2026)
      .then(setGames)
      .catch(console.error)
      .finally(() => setGamesLoading(false));
  }, []);

  const [checkedIds, setCheckedIds] = useState<Set<string>>(
    new Set(["dodgers"]),
  );

  const handleCheckedChange = (id: string, checked: boolean) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  // チェック状態に応じてゲームをフィルタリング
  const filteredGames = useMemo(() => {
    const dodgers = checkedIds.has("dodgers");
    const sasaki = checkedIds.has("sasaki");

    if (!dodgers && !sasaki) return [];
    if (dodgers && !sasaki) return games;
    if (!dodgers && sasaki) {
      return games
        .filter((game) => game.probablePitcherID === SASAKI_MLB_ID)
        .map((game) => ({
          ...game,
          tag: "佐々木朗希先発予定",
        }));
    }

    // 両方チェック：全試合表示、佐々木登板試合はタグを上書き
    return games.map((game) => ({
      ...game,
      tag:
        game.probablePitcherID === SASAKI_MLB_ID
          ? "佐々木朗希先発予定"
          : "ドジャース全試合",
    }));
  }, [games, checkedIds]);

  return (
    <>
      <Box
        minH="100vh"
        bg="gray.900"
        display="flex"
        flexDirection="column"
        alignItems="center"
        pt={16}
        px={4}
      >
        <Text fontSize="3xl" fontWeight="bold" color="white" mb={4}>
          SportsCalendar Sync
        </Text>
        <Text
          fontSize="sm"
          color="whiteAlpha.700"
          textAlign="center"
          maxW="md"
          mb={2}
        >
          一度追加するだけで、ドジャース戦の日程や放送スケジュール、先発予定があなたのカレンダーに自動更新で同期され続けます
        </Text>
        <Box w="full" maxW="3xl">
          <SubscriptionPanel
            checkedIds={checkedIds}
            onCheckedChange={handleCheckedChange}
          />
          <Box bg="gray.800" borderRadius="xl" p={6} mt={4}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={1}
            >
              <Box display="flex" alignItems="center" gap={3}>
                <Box
                  bg="blue.500"
                  color="white"
                  borderRadius="full"
                  w={7}
                  h={7}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontWeight="bold"
                  fontSize="sm"
                >
                  2
                </Box>
                <Text fontWeight="bold" fontSize="lg" color="white">
                  登録予定の試合日程プレビュー
                </Text>
              </Box>
              <Badge colorPalette="gray" px={3} py={1} borderRadius="full">
                計{filteredGames.length}件
              </Badge>
            </Box>

            <Text
              fontSize="sm"
              color="whiteAlpha.700"
              mb={4}
              ml={10}
              textAlign="left"
            >
              カレンダーに同期される試合スケジュールの一覧です。
            </Text>

            {/* 試合リスト */}
            <Box
              bg="gray.700"
              borderRadius="lg"
              overflow="hidden"
              maxH="240px" // スクロール可能な高さ
              overflowY="auto"
            >
              {gamesLoading ? (
                <Box py={6} textAlign="center">
                  <Spinner color="blue.500" size="lg" />
                </Box>
              ) : filteredGames.length === 0 ? (
                <Box py={10} textAlign="center">
                  <Text
                    fontSize="sm"
                    color="whiteAlpha.500"
                    fontWeight="bold"
                    mb={1}
                  >
                    同期対象が選ばれていません
                  </Text>
                  <Text fontSize="xs" color="whiteAlpha.400">
                    上のチェックボックスから対象を選択してください。
                  </Text>
                </Box>
              ) : (
                filteredGames.map((game, index) => (
                  <Box
                    key={game.id}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    px={4}
                    py={3}
                    borderBottom={
                      index < filteredGames.length - 1 ? "1px solid" : "none"
                    }
                    borderColor="whiteAlpha.100"
                    gap={3}
                  >
                    {/* 日付・時刻 */}
                    <Box minW="48px" textAlign="center">
                      <Text fontSize="xs" color="whiteAlpha.600">
                        {game.date}
                      </Text>
                      <Text fontSize="sm" fontWeight="bold" color="white">
                        {game.time}
                      </Text>
                    </Box>

                    {/* 試合情報 */}
                    <Box flex={1}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Text fontSize="sm" color="white">
                          {game.matchup}
                        </Text>
                        <Badge
                          colorPalette={
                            game.location === "AWAY" ? "orange" : "green"
                          }
                          size="xs"
                          variant="solid"
                        >
                          {game.location}
                        </Badge>
                      </Box>
                      <Text
                        fontSize="xs"
                        color="whiteAlpha.600"
                        mt={0.5}
                        textAlign="left"
                      >
                        {game.broadcast}
                      </Text>
                    </Box>
                    {/* タグ */}
                    <Badge
                      bg="rgba(99, 179, 237,0.12)"
                      color="blue.200"
                      border="1px solid"
                      borderColor="blue.500"
                      borderRadius="md"
                      px={2}
                      py={0.5}
                      fontSize="xs"
                      fontWeight="medium"
                      letterSpacing="wide"
                    >
                      {game.tag}
                    </Badge>
                  </Box>
                ))
              )}
            </Box>
          </Box>

          {/* Step 3: デバイス選択 */}
          <Box bg="gray.800" borderRadius="xl" p={6} mt={4}>
            <Box display="flex" alignItems="center" gap={3} mb={1}>
              <Box
                bg="blue.500"
                color="white"
                borderRadius="full"
                w={7}
                h={7}
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontWeight="bold"
                fontSize="sm"
              >
                3
              </Box>
              <Text fontWeight="bold" fontSize="lg" color="white">
                デバイスを選択して同期開始
              </Text>
            </Box>
            <Text
              fontSize="sm"
              color="whiteAlpha.700"
              mb={6}
              ml={10}
              textAlign="left"
            >
              お使いのデバイスに合わせて選択してください。日程の変更や追加は自動反映されます。
            </Text>

            {/* Googleカレンダー */}
            <Text
              fontSize="xs"
              color="blue.300"
              fontWeight="bold"
              mb={2}
              letterSpacing="wider"
            >
              FOR ANDROID / WINDOWS / GOOGLE CAL
            </Text>
            <Box
              as="button"
              w="full"
              bg="blue.500"
              _hover={{ bg: "blue.400" }}
              color="white"
              borderRadius="lg"
              py={4}
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={3}
              mb={5}
              cursor="pointer"
              fontWeight="bold"
              fontSize="md"
              transition="background 0.2s"
              onClick={() => setSyncModal("google")}
            >
              <FcGoogle size={24} />
              Googleカレンダーに同期する
            </Box>

            {/* Appleカレンダー */}
            <Text
              fontSize="xs"
              color="blue.300"
              fontWeight="bold"
              mb={2}
              letterSpacing="wider"
            >
              FOR IPHONE / MAC / APPLE CAL
            </Text>
            <Box
              as="button"
              w="full"
              bg="orange.500"
              _hover={{ bg: "orange.400" }}
              color="white"
              borderRadius="lg"
              py={4}
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={3}
              cursor="pointer"
              fontWeight="bold"
              fontSize="md"
              transition="background 0.2s"
              onClick={() => setSyncModal("apple")}
            >
              <FaApple size={24} />
              iPhone / Mac のカレンダーに追加
            </Box>

            {/* 注意書き */}
            <Text
              fontSize="xs"
              color="whiteAlpha.600"
              textAlign="center"
              mt={5}
            >
              ※「Googleカレンダーに同期する」を押すと、Googleカレンダーの自動登録プロンプト画面を直接起動します。
              <br />
              ※カレンダーへのデータ追加は安全な「購読（ウェブカレンダー経由）」として処理されます。
            </Text>
          </Box>

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
      {syncModal && (
        <CalendarSyncModal
          type={syncModal}
          calendarUrl={
            "https://sports-calendar-sync.vercel.app/feed/calendar.ics"
          }
          onClose={() => setSyncModal(null)}
        />
      )}
    </>
  );
}

export default App;
