import QuizForm from "@/components/features/quizzes/QuizForm/QuizForm";
import createClient from "@/components/shared/utils/createClient";

export default async function NewQuizForm() {
  const supabase = createClient();

  const [
    { data: quizTypes, error: quizTypesErr },
    { data: questTypes, error: questTypesErr },
  ] = await Promise.all([
    supabase.rpc("get_quiz_types"),
    supabase.rpc("get_question_types"),
  ]);

  if (
    quizTypesErr ||
    !quizTypes ||
    !quizTypes.length ||
    questTypesErr ||
    !questTypes ||
    !questTypes.length
  )
    return null;

  return (
    <QuizForm
      quizTypes={quizTypes}
      questTypes={questTypes}
    />
  );
}
