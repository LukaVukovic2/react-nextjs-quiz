import { User } from "@/app/typings/user";
import { Flex, Text } from "@chakra-ui/react";
import { PopoverRoot, PopoverTrigger } from "@/components/ui/popover";
import PopoverContent from "@/components/shared/PopoverContent/PopoverContent";
import { Heading } from "@/styles/theme/components/heading";
import { Avatar } from "@/components/ui/avatar";
import { Quiz } from "@/app/typings/quiz";
import { MdExpandMore } from "react-icons/md";

export default function QuizGameplayHeader({children, quiz, user}: {children: React.ReactNode, quiz: Quiz, user: User}) {
  return (
    <Flex flexDirection="column" alignItems="start">
      <Heading
        as="h1"
        size="h5"
      >
        {quiz.title}
      </Heading>
      <Flex
        align="center"
        gap={2}
      >
        <Avatar src={user?.avatar} width="30px" height="30px" />
        <Text fontSize="13px">{user?.username}</Text>
      </Flex>
      <PopoverRoot modal={true} positioning={{placement: "left-start"}}>
        <PopoverTrigger asChild cursor="pointer">
          <MdExpandMore size={32} />
        </PopoverTrigger>
        <PopoverContent quiz={quiz} />
      </PopoverRoot>
      {children}
    </Flex>
  )
}