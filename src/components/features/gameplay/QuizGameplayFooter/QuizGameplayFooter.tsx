import { Button } from "@/styles/theme/components/button";
import { Flex } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import { FaPause } from "react-icons/fa";
import { FaRepeat } from "react-icons/fa6";

interface IQuizGameplayFooterProps {
  isFinished: boolean;
  setIsFinished: (isFinished: boolean) => void;
  resetQuiz: () => void;
  setIsPaused: Dispatch<SetStateAction<boolean>>;
}

export default function QuizGameplayFooter({
  isFinished,
  setIsFinished,
  resetQuiz,
  setIsPaused,
}: IQuizGameplayFooterProps) {
  return (
    <Flex justifyContent="space-between">
      <Button
        onClick={() => setIsFinished(true)}
        disabled={isFinished}
      >
        Finish quiz
      </Button>

      {isFinished ? (
        <Button
          type="reset"
          onClick={resetQuiz}
        >
          <FaRepeat />
        </Button>
      ) : (
        <Button
          type="button"
          onClick={() => setIsPaused(prev => !prev)}
        >
          <FaPause />
        </Button>
      )}
    </Flex>
  );
}
