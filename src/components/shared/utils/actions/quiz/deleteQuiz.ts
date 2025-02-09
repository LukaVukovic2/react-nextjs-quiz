"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "../../supabase/server";

export const deleteQuiz = async (id: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("delete_quiz", { idquiz: id });
  if (error) {
    throw error;
  }
  revalidatePath("/my-quizzes");
  return data;
};
