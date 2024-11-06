import createClient from "@/components/shared/utils/createClient";
import dynamic from "next/dynamic";
const QuizReviewForm = dynamic(() => import("../QuizReviewForm/QuizReviewForm"), { ssr: false });
const QuizReviewList = dynamic(() => import("../QuizReviewList/QuizReviewList"), { ssr: false });

export default async function QuizReviewSection({ id }: { id: string }) {
  const supabase = createClient();

  const { data: reviews, error: reviewsError } = await supabase
    .from("review")
    .select("*")
    .eq("quiz_id", id);

  if (reviewsError || !reviews) {
    return <div>Loading reviews...</div>;
  }

  const reviewerIds = reviews.map((review) => review.user_id);

  const { data: reviewers, error: reviewersError } = await supabase
    .from("profile")
    .select("*")
    .in("id", reviewerIds || []);

  if (reviewersError || !reviewers) {
    return <div>Loading reviewers...</div>;
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <QuizReviewForm />
      <QuizReviewList id={id} reviews={reviews} reviewers={reviewers} />
    </div>
  );
}
