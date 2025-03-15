import { Answer } from "./answer";
import { Question } from "./question";
import { User } from "./user";

export interface QuizBasic {
  id: string;
  user_id: string;
  title: string;
  time: string;
  id_quiz_type: string;
}

export interface QuizDetails extends QuizBasic {
  created_at: Date;
  updated_at: Date;
  rating: number;
  plays: number;
  number_of_ratings: number;
  average_score: number;
}

export interface QuizContent {
  quiz: QuizDetails;
  questions: Question[];
  answers: Answer[];
  user: User;
}

export interface QuizType {
  id: string;
  type_name: string;
  icon: string;
}