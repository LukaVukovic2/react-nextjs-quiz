"use server";
import createClient from "@/components/shared/utils/createClient";
import QuizReviewForm from "../QuizReviewForm/QuizReviewForm";
import QuizReviewList from "../QuizReviewList/QuizReviewList";
import { Flex } from "@chakra-ui/react";

export default async function QuizReviewSection({ id }: { id: string }) {
  const supabase = createClient();
  const { data: reviews } = await supabase.rpc("get_reviews_and_reviewer", { quizid: id });

  return (
    <Flex width="600px" flexDirection="column">
      <QuizReviewForm />
      <QuizReviewList id={id} reviews={reviews}/>
    </Flex>
  );
}
