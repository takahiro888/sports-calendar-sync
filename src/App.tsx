import { Text, Box, Badge } from "@chakra-ui/react";
import "./App.css";
import { SubscriptionPanel } from "@/features/subscription/components/SubscriptionPanel";

const mockGames = [
  {
    id: 1,
    date: "06/28",
    time: "11:10",
    matchup: "Dodgers vs Padres",
    location: "AWAY",
    broadcast: "SPOTV NOW",
    tag: "ドジャース全試合",
  },
  {
    id: 2,
    date: "06/29",
    time: "05:10",
    matchup: "Dodgers vs Padres",
    location: "AWAY",
    broadcast: "SPOTV NOW",
    tag: "ドジャース全試合",
  },
  {
    id: 3,
    date: "07/01",
    time: "10:40",
    matchup: "Dodgers vs Diamondbacks",
    location: "HOME",
    broadcast: "SPOTV NOW",
    tag: "ドジャース全試合",
  },
  {
    id: 4,
    date: "07/02",
    time: "10:40",
    matchup: "Dodgers vs Diamondbacks",
    location: "HOME",
    broadcast: "SPOTV NOW",
    tag: "ドジャース全試合",
  },
];

const set = new Set(["value1", "value1", "value2"]);
console.log(set);

function App() {
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
        <Box w="full" maxW="lg">
          <SubscriptionPanel />
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
              計{mockGames.length}件
            </Badge>
          </Box>

          <Text fontSize="sm" color="whiteAlpha.700" mb={4} ml={10}>
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
            {mockGames.map((game, index) => (
              <Box
                key={game.id}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                px={4}
                py={3}
                borderBottom={
                  index < mockGames.length - 1 ? "1px solid" : "none"
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
                  <Box display="flex" textAlign="center" gap={2}>
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
                  <Text fontSize="xs" color="whiteAlpha.600" mt={1}>
                    {game.broadcast}
                  </Text>
                </Box>
                {/* タグ */}
                <Badge colorPalette="blue" size="sm" variant="outline">
                  {game.tag}
                </Badge>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default App;
