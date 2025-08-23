import { Result } from "@/typings/result";
import { Box, Flex } from "@chakra-ui/react";
import "./QuizLeaderboard.css";
import clsx from "clsx";
import LeaderboardRecord from "../LeaderboardRecord.tsx/LeaderboardRecord";
import { User } from "@/typings/user";

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
      width="600px"
      gap={4}
      color="#444"
    >
      <Box
        as="ul"
        justifyContent="space-between"
        alignItems="center"
        gap={4}
        className="flex-row"
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <Box
            as="li"
            flex={1}
            key={topResults[index]?.id ?? index}
            className={clsx({
              podium: true,
              firstPlace: index === 0,
              secondPlace: index === 1,
              thirdPlace: index === 2,
            })}
          >
            <LeaderboardRecord
              result={topResults[index] || null}
              index={index}
              activeUser={activeUser}
            />
          </Box>
        ))}
      </Box>
      <Box as="ul">
        {Array.from({ length: 7 }).map((_, index) => (
          <Box
            as="li"
            key={topResults[index + 3]?.id || index}
            justifyContent="space-between"
            className={clsx({
              "leaderboard-record": true,
              highlight: activeUser?.id === topResults[index + 3]?.user_id,
            })}
          >
            <LeaderboardRecord
              result={topResults[index + 3]}
              index={index + 3}
              activeUser={activeUser}
            />
          </Box>
        ))}
      </Box>
    </Flex>
  );
}
