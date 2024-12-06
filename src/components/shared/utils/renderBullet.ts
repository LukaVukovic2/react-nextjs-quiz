import { Answer } from "@/app/typings/answer";
import { Question } from "@/app/typings/question";
import { QuestionType } from "@/app/typings/question_type";
import clsx from "clsx";

interface IPaginationBulletsProps {
  index: number;
  className: string;
  selectedAnswers: Map<string, string[] | null>;
  questions: Question[];
  correctAnswers: Answer[];
  questTypes: QuestionType[];
  isFinished: boolean;
}

export default function renderBullet({
  index,
  className,
  selectedAnswers,
  questions,
  correctAnswers,
  questTypes,
  isFinished,
}: IPaginationBulletsProps) {
  const selectedQuestionAns = selectedAnswers.get(questions[index].id);
  const correctAnswersForQuestion = correctAnswers.filter(
    (answer) => answer.question_id === questions[index].id
  );
  const isSelected = selectedQuestionAns !== null;
  const selectedAnswersArr = Array.isArray(selectedQuestionAns)
    ? selectedQuestionAns
    : [];
  const typeName = questTypes.find(
    (type) => type.id === questions[index].id_quest_type
  )?.type_name;

  let isCorrect = false;
  let hasIncorrectAnswers = false;
  let hasCorrectAnswers = false;
  let hasCorrectAnswerNotSelected = false;

  if (typeName === "Short answer") {
    const acceptableAnswers = correctAnswersForQuestion.map((answer) =>
      answer.answer.toLowerCase()
    );
    const userInput = String(selectedQuestionAns).toLowerCase().trim();
    isCorrect = acceptableAnswers.some((answer) => answer === userInput);
  } else if (typeName === "Single choice") {
    isCorrect =
      String(selectedQuestionAns) === correctAnswersForQuestion[0]?.id;
  } else if (typeName === "Multiple choice") {
    hasIncorrectAnswers = selectedAnswersArr.some(
      (id) => !correctAnswersForQuestion.some((ans) => ans.id === id)
    );
    hasCorrectAnswers = correctAnswersForQuestion.some((answer) =>
      selectedAnswersArr.includes(answer.id)
    );
    hasCorrectAnswerNotSelected = correctAnswersForQuestion.some(
      (answer) => !selectedAnswersArr.includes(answer.id)
    );
  }

  return `
    <span 
      class="${clsx({
        [className]: true,
        selectedAnswer: !isFinished && isSelected,
        correctAnswer:
          isFinished &&
          (isCorrect ||
            (!hasIncorrectAnswers &&
              hasCorrectAnswers &&
              !hasCorrectAnswerNotSelected)),
        partiallyCorrect:
          isFinished &&
          hasCorrectAnswers &&
          (hasIncorrectAnswers || hasCorrectAnswerNotSelected),
        wrongAnswer: isFinished && !isCorrect,
      })}"
      >${index + 1}  
    </span>
  `;
}
