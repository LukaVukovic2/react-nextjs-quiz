import styles from "./QuizList.module.css";
import { Card, CardBody, Text } from "@chakra-ui/react";
import Link from "next/link";
import { createClient } from "@/components/shared/utils/createClient";

export default async function QuizList() {
  const supabase = createClient();

  const { data: quizzes, error } = await supabase
    .from("quiz")
    .select("*")
    .order("title", { ascending: true });

  if (error) {
    console.error('Error fetching quizzes:', error.message);
  }

  return (
    <>
      <h1 className={styles.title}>Quiz List</h1> 
      <div className={styles.quizListContainer}>
        {(quizzes && quizzes?.length > 0) ? quizzes.map((quiz) => (
          <Card key={quiz.id}>
            <CardBody as={Link} href={`/quizzes/${quiz.id}`}>
              <Text>{quiz.title}</Text>
              <Text>{quiz.category}</Text>
            </CardBody>  
          </Card>
        )): <Text>No quizzes found</Text>}
      </div>
    </>
  );
}
