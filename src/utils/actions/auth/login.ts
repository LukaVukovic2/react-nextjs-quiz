"use server";
import { FieldValues } from "react-hook-form";
import { createClient } from "../../supabase/server";
import { revalidatePath } from "next/cache";

export const login = async (user: FieldValues) => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: user.password
  });
  if (error) return { error: error.message };
  
  revalidatePath('/', 'layout');
  return {
    user: data.user,
    session: data.session,
  };
};
