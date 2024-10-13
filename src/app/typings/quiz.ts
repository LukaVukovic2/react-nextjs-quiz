export interface Quiz {
  id: string;
  category: string;
  user_id: string;
  title: string;
  time: string;
  created_at?: Date;
  updated_at?: Date;
  average_rating?: number;
  plays?: number;
  number_of_ratings?: number;
  average_score?: number;
}