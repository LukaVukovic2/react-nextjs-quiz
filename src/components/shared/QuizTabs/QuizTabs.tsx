import createClient from "../utils/createClient";
import { notFound } from "next/navigation";
import QuizTabsClient from "./components/QuizTabsClient";
import QuizReviewSection from "@/components/features/reviews/QuizReviewSection/QuizReviewSection";

export default async function QuizTabs({ id }: { id: string }) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("get_quiz_data", {quizid: id});
  const { quiz, questions, answers, user } = data;

  if(error || !quiz) notFound();

  const { data: topResults } = await supabase.rpc("get_leaderboard", {quizid: id});

  return (
    <QuizTabsClient quiz={quiz} questions={questions} answers={answers} user={user} topResults={topResults}>
      <QuizReviewSection id={id} />
    </QuizTabsClient>
  );
}
