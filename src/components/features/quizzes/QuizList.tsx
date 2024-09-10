import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import styles from "./QuizList.module.css";
import { Card, CardBody, Text } from "@chakra-ui/react";
import Link from "next/link";

export default async function QuizList() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

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
        {quizzes && quizzes.map((quiz) => (
          <Card key={quiz.id}>
            <CardBody as={Link} href={`/quizzes/${quiz.id}`}>
              <Text>{quiz.title}</Text>
              <Text>{quiz.category}</Text>
            </CardBody>  
          </Card>
        ))}
      </div>
    </>
  );
}
