"use client";
import { Answer } from "@/app/typings/answer";
import { Question } from "@/app/typings/question";
import { Quiz } from "@/app/typings/quiz";
import { User } from "@/app/typings/user";
import {
  Flex,
  Avatar,
  Button,
  useRadioGroup,
  Box,
  Heading,
} from "@chakra-ui/react";
import QuizResultSection from "../QuizResultSection/QuizResultSection";
import { chakra } from "@chakra-ui/react";
import { useState } from "react";
import { updateQuizPlays } from "./QuizGameplaySection.utils";
import { RadioCard } from "@/components/core/RadioCard/RadioCard";
import { CheckCircleIcon, RepeatIcon } from "@chakra-ui/icons";
import { Controller, useForm } from "react-hook-form";
import { FaMinusCircle } from "react-icons/fa";

interface IQuizGameplayProps {
  quiz: Quiz;
  user: User;
  questions: Question[];
  answers: Answer[];
}

const initializeSelectedAnswers = (
  questions: Question[]
): Map<string, string | null> => {
  const map = new Map<string, string | null>();
  questions.forEach((question) => map.set(question.id, null));
  return map;
};

export default function QuizGameplaySection({
  quiz,
  user,
  questions,
  answers,
}: IQuizGameplayProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<
    Map<string, string | null>
  >(initializeSelectedAnswers(questions));
  const [score, setScore] = useState<number>();
  const [isFinished, setIsFinished] = useState(false);
  const { control, reset, setValue } = useForm();

  const groupedAnswers = answers?.reduce((acc, answer) => {
    acc[answer.question_id] = acc[answer.question_id] || [];
    acc[answer.question_id].push(answer);
    return acc;
  }, {} as { [key: string]: Answer[] });

  const handleSelectAnswer = (questionId: string, answerId: string) => {
    setSelectedAnswers((prev) => new Map(prev.set(questionId, answerId)));
    setValue(questionId, answerId);
  };

  const handleFinishQuiz = () => {
    const totalScore = Array.from(selectedAnswers).reduce(
      (score, [questionId, answerId]) => {
        const correctAnswer = answers.find(
          (answer) => answer.question_id === questionId && answer.correct_answer
        );
        return correctAnswer?.id === answerId ? score + 1 : score;
      },
      0
    );
    setScore(totalScore);
    setIsFinished(true);
    updateQuizPlays(quiz.id, quiz.plays);
  };

  const resetQuiz = () => {
    setSelectedAnswers(initializeSelectedAnswers(questions));
    setScore(undefined);
    setIsFinished(false);
    reset();
  };

  return (
    <Flex
      flexDir="column"
      gap={1}
    >
      <Flex
        align="center"
        gap={2}
      >
        {user?.avatar && <Avatar src={user.avatar} />}
        <h1>{user?.username}</h1>
      </Flex>
      <h2>{quiz.title}</h2>
      <p>{quiz.category}</p>
      <chakra.form>
        {isFinished && (
          <Button
            type="reset"
            onClick={resetQuiz}
          >
            <RepeatIcon />
          </Button>
        )}
        {questions?.map((question, index) => {
          const { getRadioProps } = useRadioGroup({
            name: question.id,
            onChange: (answerId: string) => {
              handleSelectAnswer(question.id, answerId);
            },
          });

          return (
            <div key={question.id}>
              <Heading
                as="h2"
                size="sm"
                p={1}
              >
                <Flex
                  gap={3}
                  alignItems="stretch"
                >
                  {index + 1 + ". "}
                  {question.title}
                  {isFinished &&
                    (selectedAnswers.get(question.id) ===
                    answers.find(
                      (answer) =>
                        answer.correct_answer &&
                        answer.question_id === question.id
                    )?.id ? (
                      <CheckCircleIcon
                        color="green.500"
                        boxSize={5}
                      />
                    ) : (
                      <FaMinusCircle
                        className="fa fa-lg"
                        color="red"
                      />
                    ))}
                </Flex>
              </Heading>
              <hr />
              <Controller
                control={control}
                name={question.id}
                render={(field) => (
                  <Box>
                    {groupedAnswers &&
                      groupedAnswers[question.id]?.map((answer: Answer) => {
                        const radio = getRadioProps({ value: `${answer.id}` });
                        const selectedAnsId = selectedAnswers.get(question.id);
                        radio.isChecked = selectedAnsId === answer.id;
                        return (
                          <RadioCard
                            key={answer.id}
                            {...radio}
                            {...field}
                            answer={answer}
                            isFinished={isFinished}
                            selectedAnsId={selectedAnsId}
                          >
                            {answer.answer}
                          </RadioCard>
                        );
                      })}
                  </Box>
                )}
              />
              <br />
            </div>
          );
        })}
        <Button
          onClick={() => handleFinishQuiz()}
          isDisabled={isFinished}
        >
          Finish quiz
        </Button>
      </chakra.form>
      {score !== undefined && (
        <QuizResultSection
          score={score}
          questionCount={questions.length}
        />
      )}
    </Flex>
  );
}
