export interface Quiz {
  id: string;
  user_id: string;
  title: string;
  time: string;
  id_quiz_type: string;
  created_at?: Date;
  updated_at?: Date;
  rating?: number;
  plays?: number;
  number_of_ratings?: number;
  average_score?: number;
}