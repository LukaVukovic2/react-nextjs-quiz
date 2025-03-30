import { Answer } from "@/app/typings/answer";
import clsx from "clsx";

interface IPaginationBulletsProps {
  index: number;
  className: string;
  selectedAns: string[] | null | undefined;
  correctAnswers: Answer[];
  typeName: string | undefined;
  isFinished: boolean;
}

export default function RenderBullet({
  index,
  className,
  selectedAns,
  correctAnswers,
  typeName,
  isFinished,
}: IPaginationBulletsProps) {
  const isSelected = !!selectedAns;
  const selectedAnswersArr = Array.isArray(selectedAns)
    ? selectedAns
    : [];

  let isCorrect = false;
  let hasIncorrectAnswers = false;
  let hasCorrectAnswers = false;
  let hasCorrectAnswerNotSelected = false;

  if (typeName === "Short answer") {
    const userInput = String(selectedAns).toLowerCase().trim();
    isCorrect = correctAnswers.some(({ answer }) => answer.toLowerCase() === userInput);
  } else if (typeName === "Single choice") {
    isCorrect = String(selectedAns) === correctAnswers[0]?.id;
  } else if (typeName === "Multiple choice") {
    hasIncorrectAnswers = selectedAnswersArr.some(
      (id) => !correctAnswers.some((ans) => ans.id === id)
    );
    hasCorrectAnswers = correctAnswers.some((answer) =>
      selectedAnswersArr.includes(answer.id)
    );
    hasCorrectAnswerNotSelected = correctAnswers.some(
      (answer) => !selectedAnswersArr.includes(answer.id)
    );
  }

  return (
    <span 
      className={clsx({
        [className]: true,
        selectedAnswer: !isFinished && isSelected,
        correctAnswer:
          isFinished &&
          (isCorrect ||
            (!hasIncorrectAnswers && hasCorrectAnswers && !hasCorrectAnswerNotSelected)),
        partiallyCorrect: isFinished && hasCorrectAnswers &&
          (hasIncorrectAnswers || hasCorrectAnswerNotSelected),
        wrongAnswer: isFinished && !isCorrect,
      })
    }>
      {index + 1}  
    </span>
  );
}