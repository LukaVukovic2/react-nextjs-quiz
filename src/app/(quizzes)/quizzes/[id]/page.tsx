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

  const groupedAnswers = answers?.reduce((acc, answer) => {
    acc[answer.question_id] = acc[answer.question_id] || [];
    acc[answer.question_id].push(answer);
    return acc;
  }, {} as { [key: string]: Answer[] });

  const {data: user} = await supabase.from('profile').select('*').eq('id', quiz?.user_id).single();

  const date = new Date(quiz.created_at);

  return (
    <Flex flexDir="column" gap={1}>
      <Flex align="center" gap={2}>
        {user?.avatar && <Avatar src={user.avatar} />}
        <h1>{user?.username}</h1>
      </Flex>
      <h2>{quiz.title}</h2>
      <p>{quiz.category}</p>
      <p>{date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()}</p>
      <p>{quiz.timer}</p>
      
      <div>
        {questions?.map((question, index) => (
            <div key={question.id}>
              <h2>{index + 1 + ". "}{question.title}</h2>
              <hr />
              <div>
                {groupedAnswers && groupedAnswers[question.id]?.map((answer: Answer) => (
                  <div key={answer.id}>
                    <p>{answer.answer}</p>
                  </div>
                ))}
              </div>
              <br />
            </div>
          ))}
      </div>
    </Flex>
  )
}