"use client";

import { Answer } from "@/app/typings/answer";
import { Question } from "@/app/typings/question";
import { Quiz } from "@/app/typings/quiz";
import { User } from "@/app/typings/user";
import {
  Flex,
  Avatar,
  RadioGroup,
  Button,
  useRadioGroup,
  Box,
} from "@chakra-ui/react";
import QuizResultSection from "../QuizResultSection/QuizResultSection";
import { chakra } from "@chakra-ui/react";
import styles from "./QuizGameplaySection.module.css";
import { useState } from "react";
import { updateQuizPlays } from "./QuizGameplaySection.utils";
import RadioCard from "@/components/core/RadioCard/RadioCard";

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

  const groupedAnswers = answers?.reduce((acc, answer) => {
    acc[answer.question_id] = acc[answer.question_id] || [];
    acc[answer.question_id].push(answer);
    return acc;
  }, {} as { [key: string]: Answer[] });

  const date = quiz.created_at ? new Date(quiz.created_at) : new Date();

  const handleSelectAnswer = (questionId: string, answerId: string) => {
    setSelectedAnswers((prev) => new Map(prev.set(questionId, answerId)));
  };

  const handleFinishQuiz = () => {
    const totalScore = Array.from(selectedAnswers).reduce(
      (score, [questionId, answerId]) => {
        const correctAnswer = answers.find(
          (answer) => answer.question_id === questionId && answer.correct_answer
        );
        if (correctAnswer?.id === answerId) {
          return score + 1;
        }
        return score;
      },
      0
    );
    setScore(totalScore);
    setIsFinished(true);
    updateQuizPlays(quiz.id, quiz.plays);
  };

  return (
    <>
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
        <p>
          {date.getDate() +
            "/" +
            (date.getMonth() + 1) +
            "/" +
            date.getFullYear()}
        </p>
        <p>{quiz.timer}</p>

        <chakra.form>
          {questions?.map((question, index) => {
            const { getRootProps, getRadioProps } = useRadioGroup({
              name: question.id,
              onChange: (answerId: string) => {
                handleSelectAnswer(question.id, answerId);
              },
            });
            const group = getRootProps();

            return (
              <div key={question.id}>
                <h2>
                  {index + 1 + ". "}
                  {question.title}
                </h2>
                <hr />
                <Box {...group}>
                  {groupedAnswers &&
                    groupedAnswers[question.id]?.map((answer: Answer) => {
                      const radio = getRadioProps({
                        value: `${answer.id}`,
                      });
                      const selectedAnsId = selectedAnswers.get(question.id);
                      return (
                        <RadioCard
                          key={answer.id}
                          {...radio}
                          isFinished={isFinished}
                          answer={answer}
                          selectedAnsId={selectedAnsId}
                          isCorrect={answer.correct_answer && (selectedAnsId === answer.id)}
                        >
                          {answer.answer}
                        </RadioCard>
                      );
                    })}
                </Box>
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
      </Flex>
      {score !== undefined && (
        <QuizResultSection
          score={score}
          questionCount={questions.length}
        />
      )}
    </>
  );
}
