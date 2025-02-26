"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "../../supabase/server";

export const addMultipleQuizzes = async (quizzes: FormData, userid: string) => {
  const supabase = await createClient();
  const { error } = await supabase.rpc("add_multiple_quizzes", { quizzes, userid });
  if (error) {
    console.error("Error adding multiple quizzes:", error);
    return false;
  }
  revalidatePath("/", "layout");

  return true;
};