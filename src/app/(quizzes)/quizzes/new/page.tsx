import QuizForm from "@/components/features/quizzes/QuizForm/QuizForm";
import createClient from "@/components/shared/utils/createClient";

export default async function NewQuizForm() {
  const supabase = createClient();
  const { data: quizTypes, error } = await supabase.rpc("get_quiz_types");
  if (error || !quizTypes || !quizTypes.length) return null;

  return (
    <div>
      <QuizForm quizTypes={quizTypes}/>
    </div>
  );
}