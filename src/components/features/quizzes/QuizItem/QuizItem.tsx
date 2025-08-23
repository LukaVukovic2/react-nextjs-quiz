import { QuizBasic } from "@/typings/quiz";
import { Card, Text } from "@chakra-ui/react";
import Link from "next/link";

export default function QuizItem({ quiz }: { quiz: QuizBasic }) {
  return (
    <Card.Root>
      <Card.Body>
        <Link href={`/quizzes/${quiz.id}`}>
          <Text>{quiz.title}</Text>
        </Link>
      </Card.Body>
    </Card.Root>
  );
}
