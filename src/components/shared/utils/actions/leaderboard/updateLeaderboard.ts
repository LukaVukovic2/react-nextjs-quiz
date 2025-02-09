"use server";
import { Result } from "@/app/typings/result";
import { revalidatePath } from "next/cache";
import { createClient } from "../../supabase/server";

export const updateLeaderboard = async (newresult: Result) => {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("update_leaderboard", { newresult });
  if (error) {
    console.log(error);
  }
  revalidatePath(`/quizzes/${newresult.quiz_id}`);
  return data;
};