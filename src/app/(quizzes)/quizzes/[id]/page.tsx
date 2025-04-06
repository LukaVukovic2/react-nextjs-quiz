import QuizTabs from "@/components/shared/QuizTabs/QuizTabs";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

export default async function QuizPage({ params }: { params: { id: string } }) {
  const { id: quizid } = params;
  const supabase = await createClient();

  const [
    { data: quizContent },
    { data: topResults },
    { data: questTypes },
    { data: reviews },
  ] = await Promise.all([
    supabase.rpc("get_quiz_data", { quizid }),
    supabase.rpc("get_leaderboard", { quizid }),
    supabase.rpc("get_question_types"),
    supabase.rpc("get_reviews_and_reviewers", { quizid }),
  ]);
  
  if (
    !quizContent ||
    !quizContent?.quiz ||
    !quizContent?.questions?.length ||
    !quizContent?.answers?.length ||
    !quizContent?.user ||
    !questTypes ||
    !quizContent
  )
    notFound();

  return (
    <QuizTabs
      quizContent={quizContent}
      topResults={topResults}
      questTypes={questTypes}
      reviews={reviews}
    />
  );
}