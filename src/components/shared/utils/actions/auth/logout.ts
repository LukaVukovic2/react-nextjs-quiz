"use server";

import { cookies } from "next/headers";
import { createClient } from "../../supabase/server";

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
    return true;
  }
}