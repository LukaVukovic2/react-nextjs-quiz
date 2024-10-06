
interface IQuizResultSectionProps {
  score: number;
  questionCount: number;
  averageScore: number;
}


export default function QuizResultSection({score, questionCount, averageScore}: IQuizResultSectionProps) {
  const resultPercentage = ((score / questionCount) * 100).toFixed(0);

  return (
    <>
      <p>Quiz results</p>
      <p>Your score: {resultPercentage}%</p>
      <p>Average score: {(averageScore * 100).toFixed(0)}%</p>
    </>
  );
}