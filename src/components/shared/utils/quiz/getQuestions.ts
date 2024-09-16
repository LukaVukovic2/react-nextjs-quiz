'use server';
import { createClient } from "../createClient";

const supabase = createClient();

export const getQuestions = async (quizId: string) => {
  const { data: quiz, error } = await supabase.rpc("get_questions_and_answers_by_id", {idquiz: quizId});
  if (error) {
    console.error('Error fetching quiz:', error.message);
  }
  return quiz;
}