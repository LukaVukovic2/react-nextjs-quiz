import QuizGameplaySection from "@/components/features/gameplay/QuizGameplaySection/QuizGameplaySection";
import { createClient } from "@/components/shared/utils/createClient";
import { Avatar, Flex } from "@chakra-ui/react";

interface Answer {
  id: string;
  question_id: string;
  answer: string;
}

export default async function QuizPage({params}: {params: { id: string };}) {
  const { id } = params;

  const supabase = createClient();
  const { data: quiz } = await supabase.from('quiz').select('*').eq('id', id).single();
  const { data: questions } = await supabase
  .from('question')
  .select('*', { count: 'exact' })
  .eq('quizId', id);

  const questionIds = questions?.map((q) => q.id);

  const { data: answers } = await supabase.from('answer').select('*').in('question_id', questionIds ?? []);

  const {data: user} = await supabase.from('profile').select('*').eq('id', quiz?.user_id).single();

  return (
    (questions && answers) && <QuizGameplaySection user={user} quiz={quiz} questions={questions} answers={answers}/>
  )
}