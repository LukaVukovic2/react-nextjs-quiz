
interface IQuizResultSectionProps {
  score: number;
  questionCount: number;
}


export default function QuizResultSection({score, questionCount}: IQuizResultSectionProps) {
  const resultPercentage = ((score / questionCount) * 100).toFixed(2);

  return (
    <>
      <p>Quiz results</p>
      <p>Your score: {resultPercentage}%</p>
    </>
  );
}