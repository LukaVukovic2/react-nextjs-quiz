"use client";
import { Review } from "@/typings/review";
import QuizReviewItem from "../QuizReviewItem/QuizReviewItem";
import ListPagination from "@/components/shared/ListPagination/ListPagination";
import { useSearchParams } from "next/navigation";
import { User } from "@/typings/user";

interface IQuizReviewListProps {
  id: string;
  reviews: {
    reviewDetails: Review;
    reviewer: User;
  }[];
}

export default function QuizReviewList({ id, reviews }: IQuizReviewListProps) {
  const searchParams = useSearchParams();

  if (!reviews.length) return <div>No reviews found</div>;
  const offset = 5;

  const page = searchParams.get("page");
  const currentPage = page ? +page : 1;

  const from = (currentPage - 1) * offset + 1;
  const to = from + offset - 1;
  const reviewsByPage = reviews?.slice(from - 1, to);

  return (
    <>
      {reviewsByPage.map((review) => (
        <QuizReviewItem
          key={review.reviewDetails.id}
          review={review}
        />
      ))}
      <ListPagination
        baseHref={`/quizzes/${id}`}
        currentPage={currentPage}
        totalPages={Math.ceil(reviews.length / offset)}
      />
    </>
  );
}
