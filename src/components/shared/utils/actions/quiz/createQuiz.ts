"use server";
import createClient from "@/components/shared/utils/createClient";
import { getUser } from "@/components/shared/utils/actions/user/getUser";
import { revalidatePath } from "next/cache";
import { Question } from "@/app/typings/question";
import { Quiz } from "@/app/typings/quiz";
import { redirect } from "next/navigation";

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
    const response1 = await supabase.from("quiz").insert(quiz);
    if (response1.error) throw response1.error;

    const response2 = await supabase.from("question").insert(questions);
    if (response2.error) throw response2.error;

    const response3 = await supabase.from("answer").insert(answers);
    if (response3.error) throw response3.error;

    const success =
      response1.error || response2.error || response3.error ? false : true;
    revalidatePath("/", "layout");
    return success;
  } catch (error) {
    await supabase.from("quiz").delete().match({ id: quiz.id });
    console.error("Error occurred:", error);
  }

  redirect("/quizzes");
};
