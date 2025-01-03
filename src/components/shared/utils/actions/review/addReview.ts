'use server';
import { Review } from "@/app/typings/review";
import createClient from "../../createClient";
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from "next/cache";
import { getUser } from "../user/getUser";

const supabase = createClient();

export const addReview = async (data: FormData, id: string) => {
  const comment = data.get("comment") as string || "";
  const rating = Number(data.get("rating")) || 1;

  const { data: { user } } = await getUser();

  if (!user) {
    console.error("User is null");
    return;
  }

  const new_review: Review = {
    id: uuidv4(),
    comment,
    rating,
    user_id: user.id,
    quiz_id: id,
  }

  const { error } = await supabase.rpc("add_review", { new_review });
  
  if (error) {
    console.error("Error adding review:", error.message);
    return false;
  }
  revalidatePath(`/quizzes/${id}`);
  return true;
}