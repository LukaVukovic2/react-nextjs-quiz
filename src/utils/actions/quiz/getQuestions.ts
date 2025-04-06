"use server";
import { createClient } from "../../supabase/server";

export const getQuestions = async (quizId: string) => {
  const supabase = await createClient();
  const { data: quiz, error } = await supabase.rpc(
    "get_questions_and_answers_by_id",
    { idquiz: quizId }
  );
  
  if (error) return false;
  return quiz;
};
