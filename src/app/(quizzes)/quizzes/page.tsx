import QuizList from "@/components/features/quizzes/QuizList/QuizList"
import createClient from "@/components/shared/utils/createClient";
import { notFound } from "next/navigation";

export default async function QuizListPage() {
  const supabase = createClient();
  const { data: quizzes } = await supabase
    .from("quiz")
    .select("*")
    .order("title", { ascending: true });

  if(!quizzes) {
    notFound();
  }

  return <QuizList quizzes={quizzes} />;
}