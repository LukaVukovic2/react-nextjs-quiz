"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "../../supabase/server";

export const deleteQuiz = async (id: string) => {
  const supabase = await createClient();
  const { error } = await supabase.rpc("delete_quiz", { idquiz: id });

  if (error) return false;
  
  revalidatePath("/my-quizzes");
  return true;
};
