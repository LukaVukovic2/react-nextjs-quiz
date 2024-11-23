"use client";
import { Quiz } from "@/app/typings/quiz";
import { Card, Text } from "@chakra-ui/react";
import Link from "next/link";

export default function QuizItem({ quiz }: { quiz: Quiz }) {
  return (
    <Card.Root>
      <Card.Body>
        <Link href={`/quizzes/${quiz.id}`}>
          <Text>{quiz.title}</Text>
          <Text>{quiz.category}</Text>
        </Link>
      </Card.Body>
    </Card.Root>
  );
}
