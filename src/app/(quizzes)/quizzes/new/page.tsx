import NewQuizForm from "@/components/features/quizzes/NewQuizForm/NewQuizForm";
import { createClient } from "@/components/shared/utils/supabase/server";

export default async function NewQuizPage() {
  const supabase = await createClient();

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
    !quizTypes?.length ||
    questTypesErr ||
    !questTypes ||
    !questTypes?.length
  )
    return null;

  return (
    <NewQuizForm
      quizTypes={quizTypes}
      questTypes={questTypes}
    />
  );
}