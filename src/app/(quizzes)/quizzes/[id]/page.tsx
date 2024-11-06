import LoadingSpinner from "@/components/core/LoadingSpinner/LoadingSpinner";
import QuizTabs from "@/components/shared/QuizTabs/QuizTabs";
import createClient from "@/components/shared/utils/createClient";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function QuizPage({params}: {params: { id: string };}) {
  const { id } = params;

  const supabase = createClient();
  const { data: quiz, error } = await supabase
    .from("quiz")
    .select("*")
    .eq("id", id)
    .single();

  if(error || !quiz) notFound();

  return(
      <QuizTabs quiz={quiz} />
  ) ;
}
