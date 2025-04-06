"use server";
import { getUser } from "@/components/shared/utils/actions/user/getUser";
import { revalidatePath } from "next/cache";
import { QuizBasic } from "@/typings/quiz";
import { createClient } from "../../supabase/server";
import { Question } from "@/typings/question";
import { Answer } from "@/typings/answer";

interface FormData {
  quiz: QuizBasic;
  questions: Question[];
  answers: Answer[];
}

export const createQuiz = async ({
  quiz,
  questions: new_questions,
  answers: new_answers,
}: FormData) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await getUser();

  const new_quiz = {
    ...quiz,
    user_id: user?.id,
  };
  const { error } = await supabase.rpc("create_quiz", {
    new_quiz,
    new_questions,
    new_answers,
  });

  if (error) return false;

  revalidatePath("/", "layout");
  return true;
};
