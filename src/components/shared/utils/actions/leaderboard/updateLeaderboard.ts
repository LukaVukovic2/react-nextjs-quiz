"use server";
import { Result } from "@/app/typings/result";
import createClient from "../../createClient";
import { revalidatePath } from "next/cache";

export const updateLeaderboard = async (newresult: Result) => {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("update_leaderboard", { newresult });
  if (error) {
    console.log(error);
  }
  revalidatePath(`/quizzes/${newresult.quiz_id}`);
  return data;
};