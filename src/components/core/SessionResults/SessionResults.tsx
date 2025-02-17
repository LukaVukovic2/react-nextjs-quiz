"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/components/shared/utils/supabase/client";
import { checkSessionItems } from "@/components/shared/utils/checkSessionItems";

export default function SessionResults({ message }: { message: string }) {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserId();
      setUserId(id);
    };
    fetchUserId();
  }, [message]);

  useEffect(() => {
    if (!userId) return;

    checkSessionItems(userId);
  }, [userId]);

  const getUserId = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user && !user?.is_anonymous) return user?.id;
    return null;
  };

  return null;
}
