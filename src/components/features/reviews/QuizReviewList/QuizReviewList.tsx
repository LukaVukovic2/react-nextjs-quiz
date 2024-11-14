"use client";
import { Review } from "@/app/typings/review";
import QuizReviewItem from "../QuizReviewItem/QuizReviewItem";
import Pagination from "@/components/shared/Pagination/Pagination";
import { useSearchParams } from "next/navigation";
import { User } from "@/app/typings/user";

interface IQuizReviewListProps {
  id: string;
  reviews: {
    reviewDetails: Review;
    reviewer: User;
  }[];
}

export default function QuizReviewList({id, reviews}: IQuizReviewListProps) {
  const searchParams = useSearchParams();
  const offset = 5;

  const page = searchParams.get("page");
  const currentPage = page ? +page : 1;

  const from = (currentPage - 1) * offset + 1;
  const to = from + offset - 1;
  const reviewsByPage = reviews?.slice(from - 1, to);

  return reviews && reviewsByPage && reviewsByPage.length ? (
    <>
      {reviewsByPage.map((review) => (
        <QuizReviewItem
          key={review.reviewDetails.id}
          review={review}
        />
      ))}
      <Pagination id={id} currentPage={currentPage} totalPages={Math.ceil(reviews.length / offset)}/>
    </>
  ) : (
    <div>No reviews found</div>
  );
}
