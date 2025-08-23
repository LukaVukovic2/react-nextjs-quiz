"use client";
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { checkCookieItems } from "@/utils/functions/checkCookieItems";

export default function CookieDataChecker() {
  const supabase = createClient();

  useEffect(() => {
    const fetchUserId = async () => {
      const {data: { user }} = await supabase.auth.getUser();
      if (user && !user?.is_anonymous) return user?.id;

      return null;
    };
    fetchUserId().then((id) => {
      if (id) checkCookieItems(id);
    });
  }, []);

  return null;
}
