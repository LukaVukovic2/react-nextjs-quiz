import styles from "./QuizList.module.css";
import { Text } from "@chakra-ui/react";
import QuizItem from "../QuizItem/QuizItem";
import createClient from "@/components/shared/utils/createClient";
import { notFound } from "next/navigation";
import { Quiz } from "@/app/typings/quiz";

export default async function QuizList() {
  const supabase = createClient();
  const { data: quizzes, error } = await supabase.rpc("get_quizzes");

  if (error || !quizzes) notFound();

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
        <Text>No quizzes found</Text>
      )}
    </div>
  );
}
