'use server';
import { Review } from "@/app/typings/review";
import createClient from "@/components/shared/utils/createClient";

export default async function QuizReviewItem({review}: {review: Review}) {
  const supabase = createClient();

  const {data: user} = await supabase.from('profile').select('*').eq('id', review.user_id).single();

  const date = new Date(review.created_at).toLocaleDateString();

  return (
    <div>
      <div>{user?.username}</div>
      <div>{review.comment}</div>
      <div>{review.rating}</div>
      <div>{date}</div>
    </div>
  );
}