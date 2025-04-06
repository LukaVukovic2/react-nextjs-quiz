import { User } from "@/typings/user";
import { Flex, Text } from "@chakra-ui/react";
import { PopoverRoot, PopoverTrigger } from "@/components/ui/popover";
import PopoverContent from "@/components/features/gameplay/QuizGameplayHeader/components/PopoverContent";
import { Heading } from "@/styles/theme/components/heading";
import { Avatar } from "@/components/ui/avatar";
import { QuizDetails } from "@/typings/quiz";
import { MdExpandMore } from "react-icons/md";
import QuizTimer from "../QuizTimer/QuizTimer";
import { PlayStatus } from "@/typings/playStatus";

interface IQuizGameplayHeaderProps {
  quiz: QuizDetails;
  user: User;
  resetKey: number;
  quizTime: number;
  handleFinishQuiz: (seconds: number) => void;
  playStatus: PlayStatus;
}

export default function QuizGameplayHeader({
  quiz,
  user,
  resetKey,
  quizTime,
  handleFinishQuiz,
  playStatus,
}: IQuizGameplayHeaderProps) {
  return (
    <Flex
      flexDirection="column"
      alignItems="start"
    >
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
        <Avatar
          src={user.avatar}
          width="30px"
          height="30px"
        />
        <Text fontSize="13px">{user.username}</Text>
      </Flex>

      <PopoverRoot
        modal={true}
        positioning={{ placement: "left-start" }}
      >
        <PopoverTrigger
          asChild
          cursor="pointer"
        >
          <MdExpandMore size={32} />
        </PopoverTrigger>
        <PopoverContent quiz={quiz} />
      </PopoverRoot>

      <QuizTimer
        key={resetKey}
        quizTime={+quizTime}
        handleFinishQuiz={handleFinishQuiz}
        playStatus={playStatus}
      />
    </Flex>
  );
}
