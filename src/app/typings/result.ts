export interface Result {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number;
  time: number;
  username?: string;
  created_at?: Date;
}