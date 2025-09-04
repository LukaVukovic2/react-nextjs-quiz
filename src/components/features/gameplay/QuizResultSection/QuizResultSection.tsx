import { Flex } from "@chakra-ui/react";
import QuizResultBox from "./components/QuizResultBox";
import { useMediaQuery } from "usehooks-ts";

interface IQuizResultSectionProps {
  score: number;
  questionCount: number;
  averageScore: number;
}

export default function QuizResultSection({
  score,
  questionCount,
  averageScore,
}: IQuizResultSectionProps) {
  const resultPercentage = ((score / questionCount) * 100).toFixed(0);
  const mobileMode = useMediaQuery("(max-width: 576px)");
  const avgPercentage = (averageScore * 100).toFixed(0);

  return (
    <Flex gap={2} direction={mobileMode ? "column" : "row"}>
      {mobileMode ? (
        <>
          <QuizResultBox
            title="Percentage"
            value={`${resultPercentage}%`}
          />
          <QuizResultBox title="Average" value={`${avgPercentage}%`}/>
        </>
      ) : (
        <>
          <QuizResultBox
            title="Correct"
            value={`${score}/${questionCount}`}
          />
          <QuizResultBox
            title="Percentage"
            value={`${resultPercentage}%`}
          />
          <QuizResultBox
            title="Average"
            value={`${(averageScore * 100).toFixed(0)}%`}
          />
        </>
      )}
    </Flex>
  );
}
