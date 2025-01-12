"use client";
import { Flex, Text } from "@chakra-ui/react";
import { QuizType } from "@/app/typings/quiz_type";
import Link from "next/link";

export default function QuizTypeBox({ type }: { type: QuizType }) {
  return (
    <Link href={`/quizzes/type/${type.id}?name=${type.type_name}`}>
      <Flex
        flexDirection="column"
        gap={3}
        bg="primary"
        p={5}
        alignItems="center"
      >
        <Text>{type.type_name}</Text>
        <div>
          <i className={`${type.icon} fa-2xl`}></i>
        </div>
      </Flex>
    </Link>
  );
}
