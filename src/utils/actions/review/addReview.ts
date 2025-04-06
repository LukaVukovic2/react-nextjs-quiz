"use server";
import { Review } from "@/typings/review";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";
import { createClient } from "../../supabase/server";
import { FieldValues } from "react-hook-form";

export const addReview = async (
  { comment, rating }: FieldValues,
  quiz_id: string,
  user_id: string
) => {
  const supabase = await createClient();
  const new_review: Review = {
    id: uuidv4(),
    comment,
    rating,
    user_id,
    quiz_id,
  };

  const { error } = await supabase.rpc("add_review", { new_review });

  if (error) return false;

  revalidatePath(`/quizzes/${quiz_id}`);
  return true;
};
