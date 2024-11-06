"use server";
import createClient from "@/components/shared/utils/createClient";
import { getUser } from "@/components/shared/utils/actions/user/getUser";
import { revalidatePath } from "next/cache";
import { Question } from "@/app/typings/question";
import { Quiz } from "@/app/typings/quiz";

interface FormData {
  quiz: Quiz;
  questions: { questions: Question[] };
}

export const createQuiz = async (d: FormData) => {
  const supabase = createClient();
  const {
    data: { user },
  } = await getUser();

  const quiz = { ...d.quiz, user_id: user?.id };

  const answers = d.questions.questions.flatMap((question) => question.answers);
  const questions = d.questions.questions.map((question) => {
    delete question.answers;
    return question;
  });

  try {
    const {error} = await supabase.rpc("create_quiz", { newquiz: quiz, newquestions: questions, newanswers: answers });
    if (error) throw error;

    revalidatePath("/", "layout");
    return true;
  } catch (error) {
    await supabase.from("quiz").delete().match({ id: quiz.id });
    console.error("Error occurred:", error);
    return false;
  }
};
