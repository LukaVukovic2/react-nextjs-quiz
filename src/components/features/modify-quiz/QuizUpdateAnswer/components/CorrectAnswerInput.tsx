import { useFormContext } from "react-hook-form";
import { Answer } from "@/typings/answer";
import { Question } from "@/typings/question";
import { CheckCircleIcon } from "@chakra-ui/icons";
import clsx from "clsx";

interface IQuestionStartElementProps {
  answer: Answer;
  question: Question;
  questType: string;
  correctCount: number;
  changeCorrectAnswer: (questionId: string, answer: Answer) => void;
}

export default function CorrectAnswerInput({
  answer,
  question,
  questType,
  correctCount,
  changeCorrectAnswer,
}: IQuestionStartElementProps) {
  const { register } = useFormContext();

  if (questType === "Short answer") return null;

  if (answer.correct_answer && questType === "Single choice") {
    return (
      <CheckCircleIcon
        color="green"
        fontSize="17px"
      />
    );
  }

  return (
    <input
      type={questType === "Single choice" ? "radio" : "checkbox"}
      checked={answer.correct_answer}
      {...register(`correctAnswer${answer.id}`)}
      onChange={(e) => {
        if (!e.target.checked && correctCount === 1) return;
        changeCorrectAnswer(question.id, answer);
      }}
      className={clsx({
        checkbox: questType === "Multiple choice",
      })}
      style={{ cursor: "pointer" }}
    />
  );
}
