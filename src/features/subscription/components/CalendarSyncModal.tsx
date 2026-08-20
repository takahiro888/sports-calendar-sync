import { Box, Text } from "@chakra-ui/react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { useIsMobile } from "../../../hooks/useIsMobile";
type ModalType = "google" | "apple";

type Props = {
  type: ModalType;
  calendarUrl: string;
  onClose: () => void;
};

const STEPS: Record<ModalType, string[]> = {
  google: [
    "「カレンダーURLをコピー」を押す",
    "「Googleカレンダーを開く」を押す",
    "Googleカレンダーの「他のカレンダー」→「URLで追加」を開く",
    "コピーしたURLを貼り付けて「カレンダーを追加」を押す",
  ],
  apple: [
    "「カレンダーURLをコピー」を押す",
    "「Appleカレンダーを開く」を押す",
    "カレンダーアプリの照会ダイアログが表示されます",
    "「保存（照会）」を押して追加を完了する",
  ],
};

export const CalendarSyncModal = ({ type, calendarUrl, onClose }: Props) => {
  const isGoogle = type === "google";
  const isMobile = useIsMobile();
  const steps = STEPS[type];
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(calendarUrl);
    setCopied(true);
    window.gtag?.("event", "calendar_url_copied", {
      calendar_type: type,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenCalendar = () => {
    if (isGoogle) {
      window.open(
        `https://calendar.google.com/calendar/r/settings/addbyurl`,
        "_blank",
      );
    } else {
      window.location.href = calendarUrl.replace(/^https?:\/\//, "webcal://");
    }
  };

  return (
    // オーバーレイ（クリックで閉じる）
    <Box
      position="fixed"
      inset={0}
      bg="blackAlpha.700"
      zIndex={1000}
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
      onClick={onClose}
    >
      {/* モーダル本体 */}
      <Box
        bg="gray.800"
        borderRadius="2xl"
        p={{ base: 4, sm: 6 }}
        w="full"
        maxW="xl"
        position="relative"
        onClick={(e) => e.stopPropagation()} // モーダル内のクリックは閉じない
      >
        {/* 閉じるボタン */}
        <Box
          as="button"
          position="absolute"
          top={4}
          right={4}
          color="whiteAlpha.600"
          _hover={{ color: "white" }}
          onClick={onClose}
          fontSize="2xl"
          cursor="pointer"
        >
          ×
        </Box>
        {/* タイトル */}
        <Box
          borderLeft="4px solid"
          borderColor={isGoogle ? "blue.500" : "orange.500"}
          pl={3}
          mb={5}
        >
          {/* Googleスマホ向け注意書き */}
          {isGoogle && isMobile && (
            <Box bg="yellow.900" borderRadius="xl" p={3} mb={4}>
              <Text fontSize="sm" color="yellow.300" fontWeight="bold" mb={1}>
                ⚠️ スマートフォンご利用の方へ
              </Text>
              <Text fontSize="xs" color="yellow.100">
                GoogleカレンダーアプリではURLからカレンダーを追加できません。
                パソコンから追加してください。
              </Text>
            </Box>
          )}
          <Text fontWeight="bold" fontSize="lg" color="white">
            {isGoogle
              ? "Googleカレンダーとの同期手順"
              : "Appleカレンダーとの同期手順"}
          </Text>
          <Text fontSize="xs" color="whiteAlpha.600">
            下の手順でカレンダーを追加してください。
          </Text>
        </Box>
        {/* 手順リスト */}
        <Box bg="gray.700" borderRadius="xl" p={4} mb={4}>
          {steps.map((step, i) => (
            <Box
              key={i}
              display="flex"
              alignItems="flex-start"
              gap={3}
              mb={i < steps.length - 1 ? 3 : 0}
            >
              <Box
                minW={5}
                h={5}
                borderRadius="full"
                border="1px solid"
                borderColor="whiteAlpha.400"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="xs"
                color="whiteAlpha.600"
                mt={0.5}
              >
                {i + 1}
              </Box>
              <Text fontSize="sm" color="whiteAlpha.800">
                {step}
              </Text>
            </Box>
          ))}
        </Box>

        {/* URL表示 + コピーボタン */}
        <Box
          bg="gray.700"
          borderRadius="xl"
          p={3}
          display="flex"
          flexDirection={{ base: "column", sm: "row" }}
          alignItems={{ base: "stretch", sm: "center" }}
          gap={2}
          mb={3}
        >
          <Text
            fontSize="xs"
            color="whiteAlpha.800"
            flex="1"
            wordBreak="break-all"
          >
            {calendarUrl}
          </Text>
          <Box
            as="button"
            bg={copied ? "green.600" : "gray.600"}
            _hover={{ bg: copied ? "green.600" : "gray.500" }}
            color="white"
            borderRadius="md"
            px={3}
            py={2}
            fontSize="xs"
            fontWeight="bold"
            flexShrink={0}
            alignSelf={{ base: "flex-end", sm: "auto" }}
            onClick={handleCopy}
            cursor="pointer"
            transition="background-color 0.2s"
          >
            {copied ? "コピー済み" : "コピー"}
          </Box>
        </Box>

        {/* カレンダーを開くボタン */}
        <Box
          as="button"
          w="full"
          bg={isGoogle ? "blue.500" : "orange.500"}
          _hover={{ bg: isGoogle ? "blue.400" : "orange.400" }}
          color="white"
          borderRadius="xl"
          py={3}
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={2}
          fontWeight="bold"
          fontSize="sm"
          onClick={handleOpenCalendar}
          cursor="pointer"
          mb={4}
          transition="background-color 0.2s"
        >
          {isGoogle ? <FcGoogle size={20} /> : <FaApple size={20} />}
          {isGoogle ? "Googleカレンダーを開く" : "Appleカレンダーを開く"}
        </Box>

        {/* 注意書き */}
        <Box bg="gray.700" borderRadius="xl" p={3}>
          <Text fontSize="xs" color="whiteAlpha.700">
            登録後は、試合時間・試合結果・先発予定などの最新情報が自動で同期されます。
          </Text>
          <Text fontSize="xs" color="whiteAlpha.500" mt={1}>
            ※カレンダー側の更新タイミングにより、反映まで時間がかかる場合があります。
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
