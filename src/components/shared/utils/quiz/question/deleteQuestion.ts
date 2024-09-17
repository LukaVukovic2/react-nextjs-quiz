'use server';
import { revalidatePath } from "next/cache";
import { createClient } from "../../createClient";

const supabase = createClient();

export const deleteQuestion = async (id: string) => {
  const { error } = await supabase.rpc("delete_question", { idquestion: id });
  if (error) {
    console.error(error);
    return false;
  }
  revalidatePath("/my-quizzes");
  return true;
}