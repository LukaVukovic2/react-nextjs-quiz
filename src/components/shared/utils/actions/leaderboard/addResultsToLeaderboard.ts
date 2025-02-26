"use server";
import { createClient } from "../../supabase/server";

export const addResultsToLeaderboard = async (newresults: FormData) => {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("add_results_to_leaderboard", { newresults });
  if (error) {
    console.log(error);
  }
  return data;
}