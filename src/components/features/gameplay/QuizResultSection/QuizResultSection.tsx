import { Text } from "@chakra-ui/react";

interface IQuizResultSectionProps {
  score: number;
  questionCount: number;
  averageScore: number;
}

export default function QuizResultSection({score, questionCount, averageScore}: IQuizResultSectionProps) {
  const resultPercentage = ((score / questionCount) * 100).toFixed(0);

  return (
    <>
      <Text>Quiz results</Text>
      <Text>Your score: {resultPercentage}%</Text>
      <Text>Average score: {(averageScore * 100).toFixed(0)}%</Text>
    </>
  );
}