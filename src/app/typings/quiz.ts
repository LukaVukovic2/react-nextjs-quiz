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