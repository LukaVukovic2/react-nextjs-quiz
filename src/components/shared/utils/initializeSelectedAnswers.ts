import { Question } from "@/app/typings/question";

export const initializeSelectedAnswers = (questions: Question[]): Map<string, string[] | null> => {
  const map = new Map<string, string[] | null>();
  questions.forEach((question) => map.set(question.id, null));
  return map;
};