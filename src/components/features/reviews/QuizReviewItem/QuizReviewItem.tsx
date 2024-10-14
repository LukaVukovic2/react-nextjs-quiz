"use server";
import { Review } from "@/app/typings/review";
import TimeAgo from "@/components/core/TimeAgo/TimeAgo";
import createClient from "@/components/shared/utils/createClient";

export default async function QuizReviewItem({ review }: { review: Review }) {
  const supabase = createClient();

  const { data: user } = await supabase
    .from("profile")
    .select("*")
    .eq("id", review.user_id)
    .single();

  const date = new Date(review.created_at || "");

  return (
    <div>
      <div>
        <b>{user?.username}</b> <TimeAgo date={date} />
      </div>
      <div>{review.comment}</div>
      <div>{review.rating}</div>
    </div>
  );
}
