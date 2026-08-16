import { Box, Text } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { StepHeader } from "@/components/common/StepHeader";

type Props = {
  onSync: (type: "google" | "apple") => void;
};

export const CalendarSyncSection = ({ onSync }: Props) => {
  return (
    <Box bg="gray.800" borderRadius="xl" p={6} mt={4}>
      <StepHeader step={3} title="カレンダーに同期する" />
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
        onClick={() => {
          onSync("google");
        }}
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
        onClick={() => {
          onSync("apple");
        }}
      >
        <FaApple size={24} />
        iPhone / Mac のカレンダーに追加
      </Box>

      {/* 注意書き */}
      <Text fontSize="xs" color="whiteAlpha.600" textAlign="center" mt={5}>
        ※「Googleカレンダーに同期する」を押すと、Googleカレンダーの自動登録プロンプト画面を直接起動します。
        <br />
        ※カレンダーへのデータ追加は安全な「購読（ウェブカレンダー経由）」として処理されます。
      </Text>
    </Box>
  );
};
