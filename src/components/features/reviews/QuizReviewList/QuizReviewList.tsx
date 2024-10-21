"use client";
import { Review } from "@/app/typings/review";
import QuizReviewItem from "../QuizReviewItem/QuizReviewItem";
import Pagination from "@/components/shared/Pagination/Pagination";
import { useSearchParams } from "next/navigation";
import { User } from "@/app/typings/user";

export default function QuizReviewList({id, reviews, reviewers}: {id: string; reviews: Review[]; reviewers: User[]}) {
  const searchParams = useSearchParams();
  const offset = 5;

  const page = searchParams.get("page");
  const currentPage = page ? +page : 1;

  const from = (currentPage - 1) * offset + 1;
  const to = from + offset - 1;
  const reviewsByPage = reviews?.slice(from - 1, to);

  return reviews && reviewsByPage && reviewsByPage.length ? (
    <>
      {reviewsByPage.map((review) => {
        const reviewer = reviewers.find((reviewer) => reviewer.id === review.user_id);
        return <QuizReviewItem
          key={review.id}
          review={review}
          reviewer={reviewer!}
        />
      })}
      <Pagination id={id} currentPage={currentPage} totalPages={reviews.length / offset}/>
    </>
  ) : (
    <div>No reviews found</div>
  );
}
