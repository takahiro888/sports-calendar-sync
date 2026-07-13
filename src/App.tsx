import { Text, Box } from "@chakra-ui/react";
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
        </Box>
      </Box>
    </>
  );
}

export default App;
