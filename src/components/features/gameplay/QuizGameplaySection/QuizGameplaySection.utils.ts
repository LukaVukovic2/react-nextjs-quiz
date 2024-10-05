"use server";
import createClient from "@/components/shared/utils/createClient";

const supabase = createClient();

export const updateQuizPlays = async (quizId: string, currentPlays: number = 0) => {
  await supabase.from('quiz').update({ plays: currentPlays + 1 }).eq('id', quizId);
}