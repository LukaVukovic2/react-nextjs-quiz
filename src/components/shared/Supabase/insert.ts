"use server";
import { Question } from "@/app/typings/question";
import { revalidatePath } from "next/cache";
import { getUser } from "../utils/getUser";
import { createClient } from "../utils/createClient";

interface FormData {
  quiz: {
    id: string;
    user_id: string;
    title: string;
    category: string;
    timer: number;
  };
  questions: { questions: Question[] };
}

export const supabaseInsert = async (d: FormData) => {
  const {data: {user}} = await getUser();
  const supabase = createClient();

  const quiz = { ...d.quiz, user_id: user?.id || "" };
  
  const answers = d.questions.questions.flatMap((question) => question.answers);
  const questions = d.questions.questions.map((question) => {
    delete question.answers;
    return question;
  });

  const [response1, response2, response3] = await Promise.all([
    supabase.from('quiz').insert(quiz),
    supabase.from('question').insert(questions),
    supabase.from('answer').insert(answers),
  ]);

  revalidatePath("/", 'layout');

  const success = response1.error || response2.error || response3.error ? false : true;
  return success;
};