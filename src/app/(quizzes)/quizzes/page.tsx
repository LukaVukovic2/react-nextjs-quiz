import QuizList from "@/components/features/quizzes/QuizList/QuizList";
import { Heading } from "@chakra-ui/react";

export default async function QuizListPage() {
  return (
    <>
      <Heading
        as="h1"
        size="lg"
      >
        Quiz List
      </Heading>
      <QuizList />
    </>
  );
}
