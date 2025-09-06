import { Result } from "@/typings/result";
import { User } from "@/typings/user";
import { formatToMMSS } from "@/utils/functions/formatTime";
import { Flex, Float, Text, chakra } from "@chakra-ui/react";
import NewRecordTag from "../NewRecordTag/NewRecordTag";
import styles from "./LeaderboardRecord.module.css";

const stylesFloat = {
  offsetY: -5,
  placement: "top-center" as const
}

export default function LeaderboardRecord({
  result,
  position,
  activeUser,
}: {
  position: number;
  result: Result | null;
  activeUser: User | null;
}) {
  return (
    result ? (
      <>
        <Flex
          flex={2}
          alignItems="baseline"
        >
          {position >= 4 && <Text w={6} textAlign="right">{position + "."}</Text>}

          <Flex className={styles.usernameFlex}>
            {position === 4 && (
              <Float {...stylesFloat} offsetX={10}>
                <Text fontSize="xs">Username</Text>
              </Float>
            )}
            <Text lineClamp="1" wordBreak="break-all">{result.username}</Text>

            {activeUser?.id == result.user_id && <NewRecordTag createdAt={result?.created_at}/>}
          </Flex>
        </Flex>

        <Flex
          flex={1}
          className={position <= 3 ? styles.largeText : styles.normalText}
        >
          <chakra.div
            position="relative"
            w={10}
            textAlign="center"
          >
            {position === 4 && (
              <Float {...stylesFloat}>
                <Text
                  fontSize="xs"
                >
                  Score
                </Text>
              </Float>
            )}
            {result.score}
          </chakra.div>
        </Flex>

        <chakra.div position="relative">
          {position === 4 && (
            <Float {...stylesFloat}>
              <Text fontSize="xs">Time</Text>
            </Float>
          )}
          {formatToMMSS(result.time)}
        </chakra.div>
      </>
    ) : (
      <chakra.div ml={4}>---</chakra.div>
    )
  );
}