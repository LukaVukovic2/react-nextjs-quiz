import QuizItem from "../QuizItem/QuizItem";
import { QuizDetails } from "@/typings/quiz";
import React from "react";
import { Flex } from "@chakra-ui/react";

export default function QuizList({ quizzes }: { quizzes: QuizDetails[] }) {
  return (
    <Flex
      direction="column"
      gap="3"
    >
      {quizzes &&
        quizzes?.length > 0 &&
        quizzes.map((quiz: QuizDetails) => (
          <QuizItem
            key={quiz.id}
            quiz={quiz}
          />
        ))}
    </Flex>
  );
}
