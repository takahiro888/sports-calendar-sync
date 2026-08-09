import { Box, Text, SimpleGrid } from "@chakra-ui/react";
import { initialSyncItems } from "@/data/syncItemsDate";
import { SyncItemCard } from "./SyncItemCard";

type Props = {
  checkedIds: Set<string>;
  onCheckedChange: (id: string, checked: boolean) => void;
};

export const SubscriptionPanel = ({ checkedIds, onCheckedChange }: Props) => {
  return (
    <Box bg="gray.800" borderRadius="xl" p={6}>
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
          1
        </Box>
        <Text fontWeight="bold" fontSize="lg" color="white">
          同期する対象を選ぶ
        </Text>
      </Box>
      <Text
        fontSize="sm"
        color="whiteAlpha.700"
        mb={4}
        ml={10}
        textAlign="left"
      >
        カレンダーに入れたい球団や選手にチェックを入れてください。
      </Text>

      <SimpleGrid columns={2} gap={3}>
        {initialSyncItems.map((item) => (
          <SyncItemCard
            key={item.id}
            item={item}
            checked={checkedIds.has(item.id)}
            onChange={onCheckedChange}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};
