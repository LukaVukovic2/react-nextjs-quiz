import { Answer } from "@/app/typings/answer";

export const groupAnswersByQuestion = (answers: Answer[]) => {
  return answers?.reduce((acc, answer) => {
    acc[answer.question_id] = acc[answer.question_id] || [];
    acc[answer.question_id].push(answer);
    return acc;
  }, {} as { [key: string]: Answer[] });
}