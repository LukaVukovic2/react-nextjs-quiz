import QuizTabs from "@/components/shared/QuizTabs/QuizTabs";
import { createClient } from "@/components/shared/utils/supabase/server";
import { notFound } from "next/navigation";

export default async function QuizPage({params}: {params: { id: string };}) {
  const { id: quizid } = params;
  const supabase = await createClient();
  
  const [
    { data: quizContent, error: quizError },
    { data: topResults },
    { data: questTypes, error: questTypesError },
    { data: reviews },
  ] = await Promise.all([
    supabase.rpc("get_quiz_data", { quizid }),
    supabase.rpc("get_leaderboard", { quizid }),
    supabase.rpc("get_question_types"),
    supabase.rpc("get_reviews_and_reviewers", { quizid }),
  ]);
  if (quizError || !quizContent || !questTypes || questTypesError) notFound();

  return (
    <QuizTabs
      quizContent={quizContent}
      topResults={topResults}
      questTypes={questTypes}
      reviews={reviews}
    />
  );
}