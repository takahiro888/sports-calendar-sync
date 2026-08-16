import { Box, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

type Props = {
  step: number;
  title: string;
  badge?: ReactNode;
};

export const StepHeader = ({ step, title, badge }: Props) => (
  <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
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
        {step}
      </Box>
      <Text fontWeight="bold" fontSize="lg" color="white">
        {title}
      </Text>
    </Box>
    {badge}
  </Box>
);
