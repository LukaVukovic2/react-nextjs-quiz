import { Answer } from "@/typings/answer";
import { Question } from "@/typings/question";
import { InputGroup } from "@/components/ui/input-group";
import { Button } from "@/styles/theme/components/button";
import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import clsx from "clsx";
import CorrectAnswerInput from "./components/CorrectAnswerInput";
import { useContext, useMemo } from "react";
import { QuizUpdateContext } from "@/utils/contexts/QuizUpdateContext";
import debounce from "debounce";
import { TbTrash, TbTrashOff } from "react-icons/tb";

interface IQuizUpdateQuestionProps {
  question: Question;
  questType: "Short answer" | "Single choice" | "Multiple choice";
}

const MIN_ANSWERS = {
  "Short answer": 1,
  "Single choice": 2,
  "Multiple choice": 2,
};

export default function QuizUpdateAnswer({
  question,
  questType,
}: IQuizUpdateQuestionProps) {
  const { register, trigger } = useFormContext();
  const { answersArr, setAnswersArr, setDirtyAnswers, setDeletedAnswers } =
    useContext(QuizUpdateContext);

  const answersForQuestion = useMemo(
    () => answersArr.filter((ans) => ans.question_id === question.id),
    [answersArr, question.id]
  );

  const correctAnswerCount = answersForQuestion.filter(
    (a) => a.correct_answer
  ).length;

  const getUpdatedAnswersArr = (answers: Answer[], updatedAns: Answer) => {
    const index = answers.findIndex((item) => item.id === updatedAns.id);
    return index === -1
      ? [...answers, updatedAns]
      : answers.map((a) => (a.id === updatedAns.id ? updatedAns : a));
  };

  const changeAnswer = (text: string, targetAnswer: Answer) => {
    setAnswersArr((prev) =>
      prev.map((ans) => {
        if (ans.id === targetAnswer.id) {
          return { ...ans, answer: text };
        }
        return ans;
      })
    );
    setDirtyAnswers((prev) =>
      getUpdatedAnswersArr(prev, { ...targetAnswer, answer: text })
    );
  };

  const getUpdatedAnswer = (ans: Answer, targetAns: Answer) => {
    if (questType === "Single choice") {
      return {
        ...ans,
        correct_answer: ans.id === targetAns.id,
      };
    } else if (questType === "Multiple choice") {
      return {
        ...ans,
        correct_answer:
          ans.id === targetAns.id ? !ans.correct_answer : ans.correct_answer,
      };
    }
    return ans;
  };

  const changeCorrectAnswer = (questionId: string, targetAnswer: Answer) => {
    setAnswersArr((prev) =>
      prev.map((ans) => {
        if (ans.question_id !== questionId) return ans;
        return getUpdatedAnswer(ans, targetAnswer);
      })
    );
    setDirtyAnswers((prev) => {
      const dirtyAns = [...prev];
      answersForQuestion.forEach((answer) => {
        const updatedAnswer = getUpdatedAnswer(answer, targetAnswer);
        const answerIndex = dirtyAns.findIndex(
          (ans) => ans.id === updatedAnswer.id
        );
        if (answerIndex === -1) {
          dirtyAns.push(updatedAnswer);
        } else {
          dirtyAns[answerIndex] = updatedAnswer;
        }
      });
      return dirtyAns;
    });
  };

  const deleteAnswer = (deletedId: string) => {
    setAnswersArr((prev) => prev.filter(({ id }) => id !== deletedId));
    setDirtyAnswers((prev) => prev.filter(({ id }) => id !== deletedId));
    setDeletedAnswers((prev) => [...prev, deletedId]);
    trigger();
  };

  return answersForQuestion.map((answer) => {
    const disableDelete =
      answersForQuestion.length <= MIN_ANSWERS[questType] ||
      (correctAnswerCount === 1 && answer.correct_answer);
    const TrashIcon = disableDelete ? TbTrashOff : TbTrash;
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
              <TrashIcon
                size={20}
                color={!disableDelete ? "red" : "inherit"}
              />
            </Button>
          }
        >
          <Input
            placeholder="Answer"
            defaultValue={answer.answer}
            {...register(`answer${answer.id}`, {
              required: true,
              onChange: debounce(
                (e) => changeAnswer(e.target.value, answer),
                500
              ),
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
