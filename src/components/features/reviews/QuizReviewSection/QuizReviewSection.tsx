import createClient from "@/components/shared/utils/createClient";
import QuizReviewForm from "../QuizReviewForm/QuizReviewForm";
import QuizReviewList from "../QuizReviewList/QuizReviewList";

export default async function QuizReviewSection({id}: {id: string}) {
  const supabase = createClient();

  const { data: reviews } = await supabase
    .from("review")
    .select("*")
    .eq("quiz_id", id);

  const reviewerIds = reviews?.map((review) => review.user_id);
  
  const { data: reviewers } = await supabase
    .from("profile")
    .select("*")
    .in("id", reviewerIds || []);

  return (
    <div style={{maxWidth: "600px", margin: "0 auto"}}>
      <QuizReviewForm />
      <QuizReviewList id={id} reviews={reviews!} reviewers={reviewers!} />
    </div>
  )
}