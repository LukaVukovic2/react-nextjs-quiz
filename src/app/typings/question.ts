import { Answer } from "./answer";

export interface Question {
  id: string;
  title: string;
  quizId: string;
  answers?: Answer[];
}