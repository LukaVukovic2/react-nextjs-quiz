"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../createClient";

const supabase = createClient();

export const deleteAnswer = async (answerId: string) => {
  const { data, error } = await supabase.rpc("delete_answer", {idanswer: answerId});
  if (error) {
    console.error('Error deleting answer:', error.message);
  }
  revalidatePath("/my-quizzes");
  return data;
}