import { PlayStatus } from "@/typings/playStatus";
import { Button } from "@/styles/theme/components/button";
import { Flex } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import { FaPause } from "react-icons/fa";
import { FaRepeat } from "react-icons/fa6";

interface IQuizGameplayFooterProps {
  resetQuiz: () => void;
  playStatus: PlayStatus;
  setPlayStatus: Dispatch<SetStateAction<PlayStatus>>;
}

export default function QuizGameplayFooter({
  resetQuiz,
  playStatus,
  setPlayStatus,
}: IQuizGameplayFooterProps) {
  const finishQuiz = () => setPlayStatus("finished");
  const pauseQuiz = () => {
    if (playStatus === "playing") {
      setPlayStatus("paused");
    } else if (playStatus === "paused") {
      setPlayStatus("playing");
    }
  };
  const isFinished = playStatus === "finished";
  return (
    <Flex justifyContent="space-between">
      <Button
        onClick={finishQuiz}
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
          onClick={pauseQuiz}
        >
          <FaPause />
        </Button>
      )}
    </Flex>
  );
}
