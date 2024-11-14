"use client";
import styles from "./QuizList.module.css";
import QuizItem from "../QuizItem/QuizItem";
import { Quiz } from "@/app/typings/quiz";
import LoadingSpinner from "@/components/core/LoadingSpinner/LoadingSpinner";
import { useState, useEffect } from "react";
import { Heading } from "@chakra-ui/react";

export default function QuizList({quizzes}: {quizzes: Quiz[]}) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) {
    return <LoadingSpinner text="Loading quizzes..." />;
  }
  return (
    <>
      <Heading as="h1">
        Quiz List
      </Heading>
      <div className={styles.quizListContainer}>
        {quizzes && quizzes?.length > 0 ? (
          quizzes.map((quiz: Quiz) => (
            <QuizItem
              key={quiz.id}
              quiz={quiz}
            />
          ))
        ) : (
          <p>No quizzes found</p>
        )}
      </div>
    </>
  );
}
