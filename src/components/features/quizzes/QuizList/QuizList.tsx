"use client";
import styles from "./QuizList.module.css";
import QuizItem from "../QuizItem/QuizItem";
import { Quiz } from "@/app/typings/quiz";

export default function QuizList({quizzes}: {quizzes: Quiz[]}) {
  return (
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
  );
}
