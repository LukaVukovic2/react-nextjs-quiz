import { useFormContext } from "react-hook-form";
import { Answer } from "@/app/typings/answer";
import { Question } from "@/app/typings/question";
import { CheckCircleIcon } from "@chakra-ui/icons";
import clsx from "clsx";

interface IQuestionStartElementProps {
  answer: Answer;
  question: Question;
  questType: string;
  correctCount: number;
  changeCorrectAnswer: (
    questionId: string,
    answerId: string,
    questionType: string
  ) => void;
}

export default function CorrectAnswerInput({answer, question, questType, correctCount, changeCorrectAnswer}: IQuestionStartElementProps) {
  if(questType === "Short answer") return null;

  if (answer.correct_answer && questType === "Single choice") {
    return <CheckCircleIcon color="green" fontSize="17px" />;
  }
  const { register } = useFormContext();

  return (
    <input
      type={questType === "Single choice" ? "radio" : "checkbox"}
      checked={answer.correct_answer}
      {...register(`answer${answer.id}`)}
      onChange={(e) =>{
        if(!e.target.checked && correctCount === 1) return;
        changeCorrectAnswer(question.id, answer.id, questType)
      }
      }
      className={clsx({
        checkbox: questType === "Multiple choice",
      })}
      style={{ cursor: "pointer" }}
    />
  );
}