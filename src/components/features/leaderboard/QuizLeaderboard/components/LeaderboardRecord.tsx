import { Result } from "@/app/typings/result";
import { formatToMMSS } from "@/components/shared/utils/formatTime";
import { Tag } from "@/components/ui/tag";
import { Flex, Float, Text, chakra } from "@chakra-ui/react";
import { User } from "@supabase/supabase-js";

export default function LeaderboardRecord({
  result,
  index,
  user
}: {
  index: number;
  result: Result | null;
  user: User | null;
}) {
  const recentResultCheck = (created_at: Date) => {
    const created_at_date = new Date(created_at);
    const now = new Date();
    const diff = now.getTime() - created_at_date.getTime();
    if (diff < 5 * 60 * 1000) {
      return true;
    }
    return false;
  };

  return (
    <>
      {result ? (
        <>
          <Flex
            flex={2}
            alignItems="baseline"
          >
            {index >= 3 && (
              <Text
                w={6}
                textAlign="right"
              >
                {index + 1 + "."}
              </Text>
            )}
            <Flex position="relative" alignItems="center" justifyContent="center" flexWrap="wrap" px={3}>
              {index === 3 && 
                <Float placement="top-start" offsetY={-5} offsetX={10}>
                  <Text fontSize="xs">Username</Text>
                </Float>
              }
              {result.username}
              {user?.id == result.user_id && recentResultCheck(result.created_at ?? new Date()) && (
                <Tag colorPalette="orange" variant="solid" ml={2}>NEW!</Tag>
              )}
            </Flex>
          </Flex>
          <Flex
            flex={1}
            fontWeight="bolder"
            fontSize={index < 3 ? "20px" : "17px"}
          >
            <chakra.div position="relative" w={10} textAlign="center">
              {index === 3 && 
                <Float placement="top-center" offsetY={-5}>
                  <Text fontSize="xs" fontWeight="normal">Score</Text>
                </Float>}
              {result.score}
            </chakra.div>
          </Flex>
          <chakra.div position="relative">
            {index === 3 && 
              <Float placement="top-center" offsetY={-5}>
                <Text fontSize="xs">Time</Text>
              </Float>}
            {formatToMMSS(result.time)}
          </chakra.div>
        </>
      ) : (
        <chakra.div ml={4}>
          ---
        </chakra.div>
      )}
    </>
  );
}
