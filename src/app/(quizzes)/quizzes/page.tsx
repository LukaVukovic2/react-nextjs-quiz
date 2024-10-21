import LoadingSpinner from "@/components/core/LoadingSpinner/LoadingSpinner";
import QuizList from "@/components/features/quizzes/QuizList/QuizList";
import { Heading } from "@chakra-ui/react";
import { Suspense } from "react";

export default async function QuizListPage() {
  return (
    <>
      <Heading
        as="h1"
        size="lg"
      >
        Quiz List
      </Heading>
      <Suspense fallback={<LoadingSpinner text="Loading quizzes..." />}>
        <QuizList />
      </Suspense>
    </>
  );
}