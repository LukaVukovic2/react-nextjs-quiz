"use client";
import { Quiz } from "@/app/typings/quiz";
import { Card, CardBody, Text } from "@chakra-ui/react";
import Link from "next/link";

export default function QuizItem({quiz}: {quiz: Quiz}) {
  return (
    <Card>
      <CardBody
        as={Link}
        href={`/quizzes/${quiz.id}`}
      >
        <Text>{quiz.title}</Text>
        <Text>{quiz.category}</Text>
      </CardBody>
    </Card>
  );
}
