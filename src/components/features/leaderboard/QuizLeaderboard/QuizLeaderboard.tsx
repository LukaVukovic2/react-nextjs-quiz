import { Result } from "@/app/typings/result";
import { Flex, Heading, List, ListItem, Text } from "@chakra-ui/react";

export default function Leaderboard({topResults}: {topResults: Result[]}) {
  return (
    <>
      <Heading as="h1" size="lg">Leaderboard</Heading>
      <List>
        {
          topResults.map((result, index) => (
            <ListItem key={result.id}>
              <Flex gap={3}>
                <Text w={5} textAlign="right">{index + 1}.</Text>
                <Flex flex={1} justifyContent="space-between">
                  <Text>{result.username}</Text>
                  <Text fontWeight="bold">{result.score}</Text>
                  <Text>{result.time}</Text>
                </Flex>
              </Flex>
            </ListItem>
          ))
        }
      </List>
    </>
  )
}