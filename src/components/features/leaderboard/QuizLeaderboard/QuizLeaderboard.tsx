import { Result } from "@/app/typings/result";
import { getUser } from "@/components/shared/utils/actions/user/getUser";
import { Center, Flex, Heading, List, ListItem, Text } from "@chakra-ui/react";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import styles from "./QuizLeaderboard.module.css";

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
    <Flex flexDirection="column" width="600px" gap={2}>
      <Heading
        as="h1"
        size="lg"
        textAlign="center"
      >
        Leaderboard
      </Heading>
      <List>
        {topResults.map((result, index) => (
          <ListItem
            key={result.id}
            className={`${styles.listItem} ${user?.id == result.user_id ? styles.highlight : styles.regular}`}
            p={2}
          >
            <Flex gap={3}>
              <Text
                w={6}
                textAlign="right"
              >
                {index + 1}.
              </Text>
              <Flex
                flex={1}
                justifyContent="space-between"
              >
                <Text flex={2}>
                  {result.username}
                  {user?.id == result.user_id &&
                    recentResultCheck(result.created_at ?? new Date()) && (
                      <span className={styles.recent}>NEW</span>
                    )}
                </Text>
                <Text
                  flex={1}
                  fontWeight="bold"
                >
                  {result.score}
                </Text>
                <Text>{result.time}</Text>
              </Flex>
            </Flex>
          </ListItem>
        ))}
      </List>
    </Flex>
  );
}
