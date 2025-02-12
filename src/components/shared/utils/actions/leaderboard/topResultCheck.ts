"use server";
import { Result } from "@/app/typings/result";
import { createClient } from "../../supabase/server";

export const topResultCheck = async (newresult: Result) => {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("is_top_result", { newresult });
  if (error) {
    console.log(error);
  }
  return data;
};