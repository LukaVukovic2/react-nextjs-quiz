"use server";

import { createClient } from "../../supabase/server";
import { redirect } from "next/navigation";

export const logout = async () => {
  const supabase = await createClient();
  const {data: {session}} = await supabase.auth.getSession();

  if(session) {
    await supabase.auth.signOut();
  }

  return redirect('/');
}