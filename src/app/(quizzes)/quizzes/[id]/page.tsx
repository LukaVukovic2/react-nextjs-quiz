import QuizLayout from "@/components/shared/layouts/QuizLayout/QuizLayout";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export const generateMetadata = async ({ params }: Props) => {
  const { id } = await params;
  const supabase = await createClient();
  const { data: title } = await supabase.rpc("get_quiz_title", { quiz_id: id });

  return {
    title,
    description: `Quiz App - ${title}`,
  };
};

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
    <QuizLayout
      quizContent={quizContent}
      topResults={topResults}
      questTypes={questTypes}
      reviews={reviews}
    />
  );
}