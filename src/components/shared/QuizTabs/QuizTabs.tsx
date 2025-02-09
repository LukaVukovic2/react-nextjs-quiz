import { notFound } from "next/navigation";
import QuizTabsClient from "./components/QuizTabsClient";
import QuizReviewSection from "@/components/features/reviews/QuizReviewSection/QuizReviewSection";
import { createClient } from "../utils/supabase/server";

export default async function QuizTabs({ id }: { id: string }) {
  const supabase = await createClient();

  const [
    { data: quizData, error: quizError },
    { data: topResults },
    { data: questTypes, error: questTypesError },
  ] = await Promise.all([
    supabase.rpc("get_quiz_data", { quizid: id }),
    supabase.rpc("get_leaderboard", { quizid: id }),
    supabase.rpc("get_question_types"),
  ]);
  if (quizError || !quizData.quiz || !questTypes || questTypesError) notFound();

  const { quiz, questions, answers, user } = quizData;

  return (
    <QuizTabsClient
      quiz={quiz}
      questions={questions}
      answers={answers}
      user={user}
      topResults={topResults}
      questTypes={questTypes}
    >
      <QuizReviewSection id={id} />
    </QuizTabsClient>
  );
}
