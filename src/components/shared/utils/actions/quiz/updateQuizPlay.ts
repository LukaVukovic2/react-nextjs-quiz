"use server";
import createClient from "@/components/shared/utils/createClient";
import { revalidatePath } from "next/cache";

const supabase = createClient();

export const updateQuizPlay = async (
  quiz_id: string,
  currentPlays: number = 0,
  average_score: number = 0,
  totalScore: number
) => {
  const updatedPlays = currentPlays + 1;
  const updatedAverageScore =
    (average_score * currentPlays + totalScore) / updatedPlays;

  const { error } = await supabase.rpc("update_quiz_plays", { updatedplays: updatedPlays, updatedavgscore: updatedAverageScore, quizid: quiz_id });
  if (error) {
    console.error(error);
    return false;
  }

  revalidatePath(`/quizzes/${quiz_id}`);
};