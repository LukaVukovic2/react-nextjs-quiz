"use client";
import { useEffect, useRef, useState } from "react";
import { createClient } from "../supabase/client";
import { User } from "@supabase/supabase-js";

export const useUser = () => {
  const [user, setUser] = useState<User | null | undefined>();
  const [username, setUsername] = useState<string | null | undefined>();
  const supabase = createClient();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const fetchUsername = async (sessionUser: User) => {
      const { data: usernameData, error } = await supabase.rpc("get_username", { user_id: sessionUser.id });
      if (error) {
        console.error("Error fetching username:", error);
        return;
      }
      setUsername(usernameData);
    };

    supabase.auth.onAuthStateChange(
      async (event, session) => {
        const sessionUser = session?.user;
  
        if (sessionUser) {
          const shouldUpdate = sessionUser?.updated_at !== user?.updated_at;
          if (shouldUpdate) {
            setUser(sessionUser);
            fetchUsername(sessionUser);
          }
        } else {
          setUser(null);
          setUsername(null);
        }
      }
    );
  });

  return { user, username };
};