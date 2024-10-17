import styles from "./QuizList.module.css";
import { Heading, Text } from "@chakra-ui/react";
import QuizItem from "../QuizItem/QuizItem";
import { Quiz } from "@/app/typings/quiz";

export default async function QuizList({quizzes}: {quizzes: Quiz[]}) {
  return (
    <>
      <Heading
        as="h1"
        size="lg"
        className={styles.title}
      >
        Quiz List
      </Heading>
      <div className={styles.quizListContainer}>
        {quizzes && quizzes?.length > 0 ? (
          quizzes.map((quiz) => (
            <QuizItem key={quiz.id} quiz={quiz} />
          ))
        ) : (
          <Text>No quizzes found</Text>
        )}
      </div>
    </>
  );
}
