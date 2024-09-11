"use server";
import { Question } from "@/app/typings/question";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

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
  const cookieStore = cookies();

  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const quiz = d.quiz;
  quiz.user_id = user?.id || "";
  
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

  console.log(response1, response2, response3);

  revalidatePath("/", 'layout');

  const success = false;
  return success;
};