import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface Answer {
  id: string;
  questionid: string;
  answer: string;
}

export default async function QuizPage({params}: {params: { id: string };}) {
  const { id } = params;

  const supabase = createClientComponentClient();
  const { data: quiz } = await supabase.from('quiz').select('*').eq('id', id).single();
  const { data: questions } = await supabase
  .from('question')
  .select('*', { count: 'exact' })
  .eq('quizid', id);

  const questionIds = questions?.map((q) => q.id);

  const { data: answers } = await supabase.from('answer').select('*').in('questionid', questionIds ?? []);

  const groupedAnswers = answers?.reduce((acc, answer) => {
    acc[answer.questionid] = acc[answer.questionid] || [];
    acc[answer.questionid].push(answer);
    return acc;
  }, {} as { [key: string]: Answer[] });

  const date = new Date(quiz.created_at);

  return (
    <div>
      <div>
        <h1>{quiz.title}</h1>
        <p>{quiz.category}</p>
        <p>{date.getDay() + '/' + date.getMonth() + '/' + date.getFullYear()}</p>
        <p>{quiz.time}</p>
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
      </div>
    </div>
  )
}