import { Button } from "@/styles/theme/components/button";
import { Flex } from "@chakra-ui/react";

interface IQuizGameplayFooterProps {
  isFinished: boolean;
  setIsFinished: (isFinished: boolean) => void;
  resetQuiz: () => void;
}

export default function QuizGameplayFooter({isFinished, setIsFinished, resetQuiz}: IQuizGameplayFooterProps) {
  return (
    <Flex justifyContent="space-between">
      <Button
        onClick={() => setIsFinished(true)}
        disabled={isFinished}
      >
        Finish quiz
      </Button>
      {isFinished && (
        <Button
          type="reset"
          onClick={resetQuiz}
        >
          <i className="fa-solid fa-repeat"></i>
        </Button>
      )}
    </Flex>
  );
}
