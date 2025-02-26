"use server";

import { cookies } from "next/headers";
import { createClient } from "../../supabase/server";
import { revalidatePath } from "next/cache";

export const logout = async () => {
  const supabase = await createClient();
  const {data: {session}} = await supabase.auth.getSession();

  if(session) {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error);
      return false;
    }
    cookies().delete("isAnonymous");
    revalidatePath("/", "layout");
    return true;
  }
}