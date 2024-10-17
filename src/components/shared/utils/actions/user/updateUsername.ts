"use server";
import { revalidatePath } from "next/cache";
import createClient from "../../createClient";

const supabase = createClient();

export const updateUsername = async (d: FormData) => {
  const id = d.get("id") as string;
  const username = d.get("username") as string;
  const { data, error } = await supabase
    .from("profile")
    .update({ username })
    .eq("id", id);
  if (error) {
    throw error;
  }
  revalidatePath("/my-profile");
  return data;
};
