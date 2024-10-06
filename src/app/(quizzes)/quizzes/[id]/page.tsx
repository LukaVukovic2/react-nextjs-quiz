import QuizTabs from "@/components/shared/QuizTabs/QuizTabs";
import createClient from "@/components/shared/utils/createClient";

export default async function QuizPage({params}: {params: { id: string };}) {
  const { id } = params;

  const supabase = createClient();
  const { data: quiz } = await supabase.from('quiz').select('*').eq('id', id).single();

  return (
    quiz ? (
      <>
        <QuizTabs quiz={quiz}/>
      </>
    ) : (
      <div>Quiz not found</div>
    )
  )
}