import { User } from "@/app/typings/user";
import { Flex, Text } from "@chakra-ui/react";
import { Heading } from "@/styles/theme/components/heading";
import { Avatar } from "@/components/ui/avatar";

export default function QuizGameplayHeader({children, title, user}: {children: React.ReactNode, title: string, user: User}) {
  return (
    <Flex flexDirection="column" alignItems="start">
      <Heading
        as="h1"
        size="h5"
      >
        {title}
      </Heading>
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