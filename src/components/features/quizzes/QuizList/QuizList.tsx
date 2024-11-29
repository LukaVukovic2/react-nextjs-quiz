"use client";
import QuizItem from "../QuizItem/QuizItem";
import { Quiz } from "@/app/typings/quiz";
import LoadingSpinner from "@/components/core/LoadingSpinner/LoadingSpinner";
import React, { useState, useEffect } from "react";
import { Flex } from "@chakra-ui/react";
 
export default function QuizList({quizzes, children}: {quizzes: Quiz[], children: React.ReactNode}) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) {
    return <LoadingSpinner text="Loading quizzes..." />;
  }
  return (
    <>
      {children}
      <Flex flexWrap="wrap" gap="2rem">
        {quizzes && quizzes?.length > 0 && (
          quizzes.map((quiz: Quiz) => (
            <QuizItem
              key={quiz.id}
              quiz={quiz}
            />
          ))
        )}
      </Flex>
    </>
  );
}