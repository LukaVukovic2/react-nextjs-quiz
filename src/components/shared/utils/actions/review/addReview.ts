'use server';
import { Review } from "@/app/typings/review";
import createClient from "../../createClient";
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from "next/cache";

const supabase = createClient();

export const addReview = async (data: FormData, id: string) => {
  const comment = data.get("comment") as string || "";
  const rating = Number(data.get("rating")) || 1;

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.error("User is null");
    return;
  }

  const newReview: Review = {
    id: uuidv4(),
    comment,
    rating,
    user_id: user.id,
    quiz_id: id,
  }

  const { error } = await supabase.rpc("add_review", { newreview: newReview });
  
  if (error) {
    console.error("Error adding review:", error.message);
    return false;
  }
  revalidatePath(`/quiz/${id}`);
  return true;
}