import QuizItem from "../QuizItem/QuizItem";
import { QuizBasic } from "@/typings/quiz";
import React from "react";
import { Flex } from "@chakra-ui/react";

export default function QuizList({
  quizzes,
  children,
}: {
  quizzes: QuizBasic[];
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Flex
        flexWrap="wrap"
        gap="2rem"
      >
        {quizzes &&
          quizzes?.length > 0 &&
          quizzes.map((quiz: QuizBasic) => (
            <QuizItem
              key={quiz.id}
              quiz={quiz}
            />
          ))}
      </Flex>
    </>
  );
}
