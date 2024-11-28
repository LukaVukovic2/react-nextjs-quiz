import { Answer } from "./answer";

export interface Question {
  id: string;
  title: string;
  quiz_id: string;
  id_quest_type: string;
  answers?: Answer[];
}