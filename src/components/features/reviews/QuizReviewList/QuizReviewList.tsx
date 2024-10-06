'use server';
import createClient from "@/components/shared/utils/createClient";
import QuizReviewItem from "../QuizReviewItem/QuizReviewItem";

export default async function QuizReviewList({id}: {id: string}) {
  const supabase = createClient();

  const { data: reviews } = await supabase.from('review').select('*').eq('quiz_id', id);

  console.log(reviews);

  return (
    <div>
      {
        reviews && reviews.length ? reviews.map((review) => <QuizReviewItem key={review.id} review={review} />)
        : <div>No reviews found</div>
      }
    </div>
  );
}