"use server";
import createClient from "@/components/shared/utils/createClient";
import QuizReviewForm from "../QuizReviewForm/QuizReviewForm";
import QuizReviewList from "../QuizReviewList/QuizReviewList";

export default async function QuizReviewSection({ id }: { id: string }) {
  const supabase = createClient();
  const { data: reviews, error } = await supabase.rpc("get_reviews_and_reviewers", { quizid: id });
  if (error || !reviews) {
    console.log(error);
    return <div>No reviews</div>;
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <QuizReviewForm />
      <QuizReviewList id={id} reviews={reviews}/>
    </div>
  );
}
