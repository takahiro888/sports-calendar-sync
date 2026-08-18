import { Box, Spinner, Text, Badge } from "@chakra-ui/react";
import { StepHeader } from "@/components/common/StepHeader";
import { useRef, useMemo, useEffect } from "react";
import type { Game } from "@/features/subscription/api/mlbApi";
import { GamePreviewItem } from "./GamePreviewItem";

type Props = {
  filteredGames: Game[];
  isLoading: boolean;
};

export const GamePreviewSection = ({ filteredGames, isLoading }: Props) => {
  // 今日以降の最初の試合インデックスを求める
  const todayRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  const firstUpcomingIndex = useMemo(() => {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const todayStr = `${mm}/${dd}`;

    return filteredGames.findIndex((game) => game.date >= todayStr);
  }, [filteredGames]);

  useEffect(() => {
    const container = previewContainerRef.current;
    const el = todayRef.current;
    if (!container || !el) return;
    container.scrollTop +=
      el.getBoundingClientRect().top - container.getBoundingClientRect().top;
  }, [firstUpcomingIndex]);

  const reversedGames = useMemo(
    () => [...filteredGames].reverse(),
    [filteredGames],
  );

  return (
    <Box bg="gray.800" borderRadius="xl" p={{ base: 4, sm: 6 }} mt={4}>
      <StepHeader
        step={2}
        title="登録予定の試合日程プレビュー"
        badge={
          <Badge colorPalette="gray" px={3} py={1} borderRadius="full">
            計{filteredGames.length}件
          </Badge>
        }
      />

      <Text
        fontSize="sm"
        color="whiteAlpha.700"
        mb={4}
        ml={{ base: 0, md: 10 }}
        textAlign="left"
      >
        カレンダーに同期される試合スケジュールの一覧です。
      </Text>

      {/* 試合リスト */}
      <Box
        ref={previewContainerRef}
        bg="gray.700"
        borderRadius="lg"
        overflow="hidden"
        maxH="240px" // スクロール可能な高さ
        overflowY="auto"
      >
        {isLoading ? (
          <Box py={6} textAlign="center">
            <Spinner color="blue.500" size="lg" />
          </Box>
        ) : filteredGames.length === 0 ? (
          <Box py={10} textAlign="center">
            <Text fontSize="sm" color="whiteAlpha.500" fontWeight="bold" mb={1}>
              同期対象が選ばれていません
            </Text>
            <Text fontSize="xs" color="whiteAlpha.400">
              上のチェックボックスから対象を選択してください。
            </Text>
          </Box>
        ) : (
          reversedGames.map((game, index) => (
            <GamePreviewItem
              key={game.id}
              game={game}
              isLast={index === reversedGames.length - 1}
              ref={
                firstUpcomingIndex !== -1 &&
                index === reversedGames.length - 1 - firstUpcomingIndex
                  ? todayRef
                  : undefined
              }
            />
          ))
        )}
      </Box>
    </Box>
  );
};
