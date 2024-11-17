import { Quiz } from "@/app/typings/quiz";
import { User } from "@/app/typings/user";
import { Flex, Avatar, Heading, Text } from "@chakra-ui/react";

export default function QuizGameplayHeader({children, quiz, user}: {children: React.ReactNode, quiz: Quiz, user: User}) {
  return (
    <Flex flexDirection="column" alignItems="start">
      <Heading
        as="h1"
        size="md"
      >
        {quiz.title}
      </Heading>
      <Text fontSize="14px">{quiz.category}</Text>
      <Flex
        align="center"
        gap={2}
      >
        <Avatar src={user?.avatar} width="30px" height="30px" />
        <Text fontSize="13px">{user?.username}</Text>
      </Flex>
      {children}
    </Flex>
  )
}