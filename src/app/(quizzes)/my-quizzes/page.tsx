import MyQuizzes from "@/components/features/quizzes/MyQuizzes/MyQuizzes";
import { getUser } from "@/utils/actions/user/getUser";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: "Quiz App - My Quizzes" };

export default async function MyQuizzesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await getUser();
  if (!user) return null;

  const [
    { data: quizTypesArr },
    { data: questTypesArr },
    { data: quizzes, error },
  ] = await Promise.all([
    supabase.rpc("get_quiz_types"),
    supabase.rpc("get_question_types"),
    supabase.rpc("get_quizzes_by_id", {
      iduser: user.id,
    }),
  ]);
  if (!quizzes || !(Array.isArray(quizzes) && quizzes.length > 0) || error) {
    notFound();
  }
  return (
    <MyQuizzes
      quizzes={quizzes}
      quizTypesArr={quizTypesArr}
      questTypesArr={questTypesArr}
    />
  );
}
