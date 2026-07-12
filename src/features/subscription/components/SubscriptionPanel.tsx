import { Box, Text, SimpleGrid } from "@chakra-ui/react";
import { useState } from "react";
import { initialSyncItems } from "@/data/syncItemsDate";
import { SyncItemCard } from "./SyncItemCard";

export const SubscriptionPanel = () => {
  const [checkedIds, setCheckedIds] = useState<Set<string>>(
    new Set(["dodgers"]),
  );

  const handleCheckboxChange = (id: string, checked: boolean) => {
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

  return (
    <Box bg="gray.800" borderRadius="xl" p={6}>
      <Box bg="red" display="flex" alignItems="center" gap={3} mb={1}>
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
      <Text fontSize="sm" color="whiteAlpha.700" mb={4} ml={10}>
        カレンダーに入れたい球団や選手にチェックを入れてください。
      </Text>

      <SimpleGrid columns={2} gap={3}>
        {initialSyncItems.map((item) => (
          <SyncItemCard
            key={item.id}
            item={item}
            checked={checkedIds.has(item.id)}
            onChange={handleCheckboxChange}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};
