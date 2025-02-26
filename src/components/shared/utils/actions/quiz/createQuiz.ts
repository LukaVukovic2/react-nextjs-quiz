"use server";
import { getUser } from "@/components/shared/utils/actions/user/getUser";
import { revalidatePath } from "next/cache";
import { Quiz } from "@/app/typings/quiz";
import { createClient } from "../../supabase/server";
import { Question } from "@/app/typings/question";
import { Answer } from "@/app/typings/answer";

interface FormData {
  quiz: Quiz;
  questions: Question[];
  answers: Answer[];
}

export const createQuiz = async ({quiz, questions: new_questions, answers: new_answers}: FormData) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await getUser();

  const new_quiz = {
    ...quiz,
    user_id: user?.id,
  }
  const { error } = await supabase.rpc("create_quiz", { new_quiz, new_questions, new_answers });

  if(error){
    console.error("Error occurred:", error);
    return false;
  }
  revalidatePath("/", "layout");
  return true;
};