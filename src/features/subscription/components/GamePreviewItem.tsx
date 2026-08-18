import type { Game } from "@/features/subscription/api/mlbApi";
import { Box, Text, Badge } from "@chakra-ui/react";

type Props = {
  game: Game;
  isLast: boolean;
  ref?: React.Ref<HTMLDivElement>;
};

// React19ではrefを通常のpropとして受け取れる
export const GamePreviewItem = ({ game, isLast, ref }: Props) => (
  <Box
    ref={ref}
    display="flex"
    alignItems="center"
    justifyContent="space-between"
    px={4}
    py={3}
    borderBottom={isLast ? "none" : "1px solid"}
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
    <Box flex={1} minW={0}>
      <Box display="flex" alignItems="center" gap={2}>
        <Text fontSize="sm" color="white">
          {game.matchup}
        </Text>
        <Badge
          colorPalette={game.location === "AWAY" ? "orange" : "green"}
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
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
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
);
