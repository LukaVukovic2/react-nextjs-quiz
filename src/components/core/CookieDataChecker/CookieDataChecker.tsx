"use client";
import { useEffect } from "react";
import { createClient } from "@/components/shared/utils/supabase/client";
import { checkCookieItems } from "@/components/shared/utils/checkCookieItems";

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
