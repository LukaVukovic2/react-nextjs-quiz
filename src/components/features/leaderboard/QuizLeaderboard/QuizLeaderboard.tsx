import { Result } from "@/app/typings/result";
import { getUser } from "@/components/shared/utils/actions/user/getUser";
import { Box, Flex } from "@chakra-ui/react";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import "./QuizLeaderboard.css";
import clsx from "clsx";
import LeaderboardRecord from "./components/LeaderboardRecord";

export default function Leaderboard({ topResults }: { topResults: Result[] }) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
      } = await getUser();
      setUser(user);
    }
    fetchUser();
  }, []);

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
            key={topResults[index].id || index}
            className={clsx({
              podium: true,
              firstPlace: index === 0,
              secondPlace: index === 1,
              thirdPlace: index === 2,
            })}
          >
            <LeaderboardRecord
              result={topResults[index]}
              index={index}
              user={user}
            />
          </Box>
        ))}
      </Box>
      <Box as="ul">
        {Array.from({ length: 7 }).map((_, index) => (
          <Box
            key={topResults[index].id || index}
            as="li"
            justifyContent="space-between"
            className={clsx({
              'leaderboard-record': true,
              highlight: user?.id == topResults[index].user_id,
            })}
          >
            <LeaderboardRecord
              result={topResults[index + 3]}
              index={index + 3}
              user={user}
            />
          </Box>
        ))}
      </Box>
    </Flex>
  );
}
