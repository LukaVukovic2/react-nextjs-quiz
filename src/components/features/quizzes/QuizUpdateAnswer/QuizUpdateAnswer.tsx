import { Answer } from "@/app/typings/answer";
import { Question } from "@/app/typings/question";
import { InputGroup } from "@/components/ui/input-group";
import { Button } from "@/styles/theme/components/button";
import { FormControl } from "@chakra-ui/form-control";
import { DeleteIcon } from "@chakra-ui/icons";
import { Input } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import clsx from "clsx";
import CorrectAnswerInput from "./components/CorrectAnswerInput";
import { useQuizUpdateContext } from "@/components/shared/utils/contexts/QuizUpdateContext";

interface IQuizUpdateQuestionProps {
  question: Question;
  questType: string;
}

export default function QuizUpdateAnswer({
  question,
  questType
}: IQuizUpdateQuestionProps) {
  const { register, trigger } = useFormContext();
  const { answersArr, dirtyAnswers, deletedAnswers } = useQuizUpdateContext(["answersArr", "dirtyAnswers", "deletedAnswers"]);
  const answersForQuestion = (answersArr.get as Answer[]).filter(ans => ans.question_id === question.id);

  const handleUpdateAnswer = async (value: string, a: Answer) => {
    const validateInput = await trigger(`answer${a.question_id}${a.id}`);
    if (!validateInput) return;

    const updatedAnswers = (answersArr.get as Answer[]).map((answer) => {
      if (answer.id === a.id) {
        return { ...answer, answer: value };
      }
      return answer;
    });

    answersArr.set(updatedAnswers);

    const dirtyAns = dirtyAnswers.get as Answer[];
    updatedAnswers.forEach((answer) => {
      const answerIndex = dirtyAns.findIndex((ans) => ans.id === answer.id);
      if (answer.id === a.id) {
        if (answerIndex === -1) {
          dirtyAns.push({ ...answer, answer: value });
        } else {
          dirtyAns[answerIndex] = { ...answer, answer: value };
        }
      }
    });

    dirtyAnswers.set(dirtyAns);
  };

  const changeCorrectAnswer = (
    questionId: string,
    answerId: string,
    questionType: string
  ) => {
    const updatedAnswers = (answersArr.get as Answer[]).map((answer) => {
      if (answer.question_id === questionId) {
        if (questionType === "Single choice") {
          return {
            ...answer,
            correct_answer: answer.id === answerId,
          };
        } else if (questionType === "Multiple choice") {
          return {
            ...answer,
            correct_answer:
              answer.id === answerId
                ? !answer.correct_answer
                : answer.correct_answer,
          };
        }
      }
      return answer;
    });
    answersArr.set(updatedAnswers);

    const dirtyAns = dirtyAnswers.get as Answer[];
    updatedAnswers.forEach((answer) => {
      const answerIndex = dirtyAns.findIndex((ans) => ans.id === answer.id);
      if (answer.question_id === questionId) {
        if (answerIndex === -1) {
          dirtyAns.push(answer);
        } else {
          dirtyAns[answerIndex] = answer;
        }
      }
    });

    dirtyAnswers.set(dirtyAns);
  };
  
  const handleDeleteAnswer = async (id: string) => {
    answersArr.set([...(answersArr.get as Answer[]).filter((ans) => ans.id !== id)]);
    dirtyAnswers.set([...(dirtyAnswers.get as Answer[]).filter((ans) => ans.id !== id)]);
    deletedAnswers.set([...(deletedAnswers.get as string[]), id]);
  };

  return answersForQuestion.map((answer) => {
    const correctAnswerCount = answersForQuestion.filter(
      (a) => a.correct_answer
    ).length;
    const disableDelete =
      (questType === "Short answer"
        ? answersForQuestion.length === 1
        : answersForQuestion.length <= 2) ||
      (correctAnswerCount === 1 && answer.correct_answer);
    return (
      <FormControl key={answer.id}>
        <InputGroup
          w="100%"
          startElement={
            <CorrectAnswerInput
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
    );
  });
}