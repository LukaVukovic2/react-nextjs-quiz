import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const createClient = () => {
  cookies().getAll();
  return createServerComponentClient({ cookies });
};

export default createClient;