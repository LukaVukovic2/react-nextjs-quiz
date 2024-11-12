import { Quiz } from "@/app/typings/quiz";
import { User } from "@/app/typings/user";
import { Flex, Avatar, Heading, Text } from "@chakra-ui/react";

export default function QuizGameplayHeader({children, quiz, user}: {children: React.ReactNode, quiz: Quiz, user: User}) {
  return (
    <>
      <Flex
        align="center"
        gap={2}
      >
        <Avatar src={user?.avatar} />
        <Text>{user?.username}</Text>
      </Flex>
      <Heading
        as="h1"
        size="md"
      >
        {quiz.title}
      </Heading>
      <Text>{quiz.category}</Text>
      {children}
    </>
  )
}