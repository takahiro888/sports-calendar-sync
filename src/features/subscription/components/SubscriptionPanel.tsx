import { Box, Text, SimpleGrid } from "@chakra-ui/react";
import type { SyncItem } from "@/types/sync";
import { SyncItemCard } from "./SyncItemCard";

type Props = {
  items: SyncItem[];
  checkedIds: Set<string>;
  onCheckedChange: (id: string, checked: boolean) => void;
};

export const SubscriptionPanel = ({
  items,
  checkedIds,
  onCheckedChange,
}: Props) => {
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
        <br />
        <Text as="span" fontSize="xs" color="whiteAlpha.500">

          ※試合予定が追加・変更された場合は、自動でカレンダーに反映されます。
        </Text>
      </Text>

      <SimpleGrid columns={2} gap={3}>
        {items.map((item) => (
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
