import { Result } from "@/typings/result";
import { Box, Flex } from "@chakra-ui/react";
import clsx from "clsx";
import LeaderboardRecord from "../LeaderboardRecord.tsx/LeaderboardRecord";
import { User } from "@/typings/user";
import styles from "./QuizLeaderboard.module.css";
import PodiumGroup from "../PodiumGroup/PodiumGroup";

interface ILeaderboardProps {
  topResults: Result[];
  activeUser: User | null;
}

export default function Leaderboard({
  topResults = [],
  activeUser,
}: ILeaderboardProps) {
  return (
    <Flex
      flexDirection="column"
      gap={4}
      color="#444"
      className={styles.leaderboardWrapper}
    >
      <PodiumGroup>
        {Array.from({ length: 3 }).map((_, index) => (
          <Box
            as="li"
            flex={1}
            key={topResults[index]?.id ?? index}
            className={clsx({
              [styles.podium]: true,
              [styles.firstPlace]: index === 0,
              [styles.secondPlace]: index === 1,
              [styles.thirdPlace]: index === 2,
            })}
          >
            <LeaderboardRecord
              result={topResults[index] || null}
              position={index + 1}
              activeUser={activeUser}
            />
          </Box>
        ))}
      </PodiumGroup>

      <Box as="ul">
        {Array.from({ length: 7 }).map((_, index) => (
          <Box
            as="li"
            key={topResults[index + 3]?.id || index}
            justifyContent="space-between"
            className={clsx({
              [styles.leaderboardRecord]: true,
              [styles.highlight]:
                activeUser?.id === topResults[index + 3]?.user_id,
            })}
          >
            <LeaderboardRecord
              result={topResults[index + 3]}
              position={index + 4}
              activeUser={activeUser}
            />
          </Box>
        ))}
      </Box>
    </Flex>
  );
}
