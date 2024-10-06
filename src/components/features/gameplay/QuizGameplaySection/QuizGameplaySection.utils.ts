"use server";
import createClient from "@/components/shared/utils/createClient";

const supabase = createClient();

export const updateQuizInfo = async (
  quizId: string,
  currentPlays: number = 0,
  average_score: number = 0,
  totalScore: number
) => {
  
  const updatedPlays = currentPlays + 1;
  const updatedAverageScore = (average_score * currentPlays + totalScore) / updatedPlays;

  await supabase
    .from("quiz")
    .update({ plays: updatedPlays, average_score: updatedAverageScore })
    .eq("id", quizId);
};
