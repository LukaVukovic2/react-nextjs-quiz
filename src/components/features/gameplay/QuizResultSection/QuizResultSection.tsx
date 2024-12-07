import { Flex } from "@chakra-ui/react";
import QuizResultBox from "./components/QuizResultBox";

interface IQuizResultSectionProps {
  score: number;
  questionCount: number;
  averageScore: number;
}

export default function QuizResultSection({score, questionCount, averageScore}: IQuizResultSectionProps) {
  const resultPercentage = ((score / questionCount) * 100).toFixed(0);

  return (
    <Flex gap={2}>
      <QuizResultBox title="Correct" value={`${score}/${questionCount}`} />
      <QuizResultBox title="Percentage" value={`${resultPercentage}%`} />
      <QuizResultBox title="Average" value={`${(averageScore * 100).toFixed(0)}%`} />
    </Flex>
  );
}