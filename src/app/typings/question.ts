import { Answer } from "./answer";

export interface Question {
  id: string;
  title: string;
  quiz_id: string;
  answers?: Answer[];
}