import { Answer } from "@/app/typings/answer";
import { Question } from "@/app/typings/question";
import { InputGroup } from "@/components/ui/input-group";
import { Button } from "@/styles/theme/components/button";
import { FormControl } from "@chakra-ui/form-control";
import { DeleteIcon } from "@chakra-ui/icons";
import { Input } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import clsx from "clsx";
import QuestionTypeInput from "./QuestionTypeInput";

interface IQuizUpdateQuestionProps {
  answersArr: Answer[];
  question: Question;
  questType: string;
  handleDeleteAnswer: (id: string) => void;
  handleUpdateAnswer: (answer: string, answerObj: Answer) => void;
  changeCorrectAnswer: (
    questionId: string,
    answerId: string,
    questionType: string
  ) => void;
}

export default function QuizUpdateQuestion({
  answersArr,
  question,
  questType,
  handleDeleteAnswer,
  handleUpdateAnswer,
  changeCorrectAnswer,
}: IQuizUpdateQuestionProps) {
  const { register } = useFormContext();

  return answersArr.map((answer) => {
    const correctAnswerCount = answersArr.filter((a) => a.correct_answer).length;
    const disableDelete = 
      (questType === "Short answer" ? answersArr.length === 1 : answersArr.length <= 2) ||
      (correctAnswerCount === 1 && answer.correct_answer);
    return (
      <FormControl key={answer.id}>
        <InputGroup
          w="100%"
          startElement={
            <QuestionTypeInput
              answer={answer}
              question={question}
              questType={questType}
              correctCount={correctAnswerCount}
              changeCorrectAnswer={changeCorrectAnswer}
            />
          }
          endElement={
            <Button
              visual="ghost"
              p={0}
              onClick={() => handleDeleteAnswer(answer.id)}
              disabled={disableDelete}
            >
              <DeleteIcon color="red" />
            </Button>
          }
        >
          <Input
            placeholder="Answer"
            defaultValue={answer.answer}
            {...register(`answer${question.id}${answer.id}`, {
              required: true,
            })}
            onBlur={(e) => {
              handleUpdateAnswer(e.target.value, answer);
            }}
            className={clsx({
              "css-1fcpzq2 short-answer": questType === "Short answer",
            })}
          />
        </InputGroup>
      </FormControl>
    )}
  );
}