"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "../../supabase/server";
import { FieldValues } from "react-hook-form";

export const updateQuiz = async ({
  dirtyQuizFields,
  dirtyQuestions,
  dirtyAnswers,
  deletedQuestions,
  deletedAnswers,
}: FieldValues) => {
  const supabase = await createClient();

  const { error } = await supabase.rpc("update_quiz", {
    updated_quiz: dirtyQuizFields,
    updated_questions: dirtyQuestions,
    updated_answers: dirtyAnswers,
    deleted_questions: deletedQuestions,
    deleted_answers: deletedAnswers,
  });
  if (error) return false;

  revalidatePath("/my-quizzes");
  return true;
};
