import {
  Text,
  Box,
  CheckboxRoot,
  CheckboxControl,
  Badge,
} from "@chakra-ui/react";
import type { SyncItem } from "@/types/sync";

type SyncItemCardProps = {
  item: SyncItem;
  checked: boolean;
  onChange: (id: string, checked: boolean) => void;
};

export const SyncItemCard = ({
  item,
  checked,
  onChange,
}: SyncItemCardProps) => {
  const isDisabled = item.disabled;

  return (
    <Box
      //   as="label" // label要素にすることでカード全体クリック可能にする
      //   htmlFor={item.id}
      border="2px solid"
      borderColor={checked ? "blue.500" : "whiteAlpha.300"}
      borderRadius="md"
      p={4}
      cursor={isDisabled ? "not-allowed" : "pointer"}
      opacity={isDisabled ? 0.4 : 1}
      bg="whiteAlpha.50"
      display="flex"
      flexDirection="column"
      gap={1}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <CheckboxRoot
          id={item.id}
          checked={checked}
          disabled={isDisabled}
          onCheckedChange={(e) => onChange(item.id, !!e.checked)}
        >
          <CheckboxControl />
        </CheckboxRoot>
        {item.badge && (
          <Badge fontSize="xs" colorPalette="gray">
            {item.badge}
          </Badge>
        )}
      </Box>
      <Text fontWeight="bold" fontSize="sm" color="white">
        {item.title}
      </Text>
      <Text fontSize="xs" color="whiteAlpha.700">
        {item.description}
      </Text>
    </Box>
  );
};
