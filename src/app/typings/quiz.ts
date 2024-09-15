export interface Quiz {
  id: string;
  category: string;
  user_id: string;
  title: string;
  timer: string;
  created_at?: Date;
  updated_at?: Date;
  rating?: number;
  plays?: number;
  number_of_ratings?: number;
}