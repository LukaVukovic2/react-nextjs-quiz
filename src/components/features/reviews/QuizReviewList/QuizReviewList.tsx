"use server";
import createClient from "@/components/shared/utils/createClient";
import QuizReviewItem from "../QuizReviewItem/QuizReviewItem";
import NextLink from "next/link";
import { Button } from "@chakra-ui/react";

export default async function QuizReviewList({
  id,
  page,
}: {
  id: string;
  page?: string;
}) {
  const supabase = createClient();
  const offset: number = 5;

  const currentPage = page ? +page : 1;
  const from = (currentPage - 1) * offset + 1;
  const to = from + offset - 1;

  const { data: reviews } = await supabase
    .from("review")
    .select("*")
    .eq("quiz_id", id);
  
  const reviewsByPage = reviews?.slice(from - 1, to);

  return (
    <div>
      {reviews && reviewsByPage && reviewsByPage.length ? (
        <>
          {reviewsByPage.map((review) => (
            <QuizReviewItem
              key={review.id}
              review={review}
            />
          ))}
          {
            currentPage > 1 && (
              <NextLink href={`/quizzes/${id}?page=${currentPage - 1}`}>
                <Button>Previous</Button>
              </NextLink>
            )
          }
          {
            reviews.length > to && (
              <NextLink href={`/quizzes/${id}?page=${currentPage + 1}`}>
                <Button>Next</Button>
              </NextLink>
            )
          }
        </>
      ) : (
        <div>No reviews found</div>
      )}
    </div>
  );
}
