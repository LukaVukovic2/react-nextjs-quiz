import { Answer } from "@/app/typings/answer";
import { Question } from "@/app/typings/question";
import { InputGroup } from "@/components/ui/input-group";
import { Button } from "@/styles/theme/components/button";
import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import clsx from "clsx";
import CorrectAnswerInput from "./components/CorrectAnswerInput";
import { useContext } from "react";
import { QuizUpdateContext } from "@/components/shared/utils/contexts/QuizUpdateContext";
import debounce from "debounce";
import { TbTrash, TbTrashOff } from "react-icons/tb";

interface IQuizUpdateQuestionProps {
  question: Question;
  questType: string;
}

export default function QuizUpdateAnswer({
  question,
  questType,
}: IQuizUpdateQuestionProps) {
  const { register, trigger } = useFormContext();
  const { answersArr, setAnswersArr, setDirtyAnswers, setDeletedAnswers } = useContext(QuizUpdateContext);

  const answersForQuestion = answersArr.filter(
    (ans) => ans.question_id === question.id
  );

  const changeAnswer = (text: string, a: Answer) =>{

    const updatedAnswers = answersArr.map((answer) => {
      if (answer.id === a.id) {
        return { ...answer, answer: text };
      }
      return answer;
    });

    setAnswersArr(updatedAnswers);

    setDirtyAnswers((prev) => {
      const dirtyAns = [...prev];
      updatedAnswers.forEach((answer) => {
        const answerIndex = dirtyAns.findIndex((ans) => ans.id === answer.id);
        if (answer.id === a.id) {
          if (answerIndex === -1) {
            dirtyAns.push({ ...answer, answer: text });
          } else {
            dirtyAns[answerIndex] = { ...answer, answer: text };
          }
        }
      });

      return dirtyAns;
    });
  };

  const changeCorrectAnswer = (
    questionId: string,
    answerId: string,
    questionType: string
  ) => {
    const updatedAnswers = answersArr.map((answer) => {
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
    setAnswersArr(updatedAnswers);

    setDirtyAnswers((prev) => {
      const dirtyAns = [...prev];
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
      return dirtyAns;
    });
  };

  const deleteAnswer = (id: string) => {
    setAnswersArr((prev) => [...prev.filter((ans) => ans.id !== id)]);
    setDirtyAnswers((prev) => [...prev.filter((ans) => ans.id !== id)]);
    setDeletedAnswers((prev) => [...prev, id]);
    trigger();
  };

  return answersForQuestion.map((answer) => {
    const correctAnswerCount = answersForQuestion.filter(a => a.correct_answer).length;
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
              onClick={() => deleteAnswer(answer.id)}
              disabled={disableDelete}
            >
              {
                disableDelete ? <TbTrashOff size={20} /> : <TbTrash size={20} color="red" />
              }
            </Button>
          }
        >
          <Input
            placeholder="Answer"
            defaultValue={answer.answer}
            {...register(`answer${answer.id}`, {
              required: true,
              onChange: debounce((e) => changeAnswer(e.target.value, answer), 500),
            })}
            className={clsx({
              "css-1fcpzq2 short-answer": questType === "Short answer",
            })}
          />
        </InputGroup>
      </FormControl>
    );
  });
}