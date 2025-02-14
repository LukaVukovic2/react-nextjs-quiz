"use client";
import { Result } from "@/app/typings/result";
import { addResultsToLeaderboard } from "@/components/shared/utils/actions/leaderboard/addResultsToLeaderboard";
import { useEffect, useState } from "react";
import { createClient } from "@/components/shared/utils/supabase/client";
import { toaster } from "@/components/ui/toaster";

export default function SessionResults({ message }: { message: string }) {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserId();
      setUserId(id);
    }
    fetchUserId();
  }, [message]);

  useEffect(() => {
    if (!userId) return;

    const res = JSON.parse(sessionStorage.getItem("results") || "[]");
    if (res.length > 0) {
      const updatedResults = res.map((result: Result) => ({ ...result, user_id: userId }));
      handleAddResults(updatedResults);
    }
  }, [userId]);

  const getUserId = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user && !user?.is_anonymous) 
      return user?.id;
    return null;
  };

  const handleAddResults = async (results: Result[]) => {
    const success = await addResultsToLeaderboard(results);
    if(!success) return;

    toaster.create({
      title: "Results added to leaderboard",
      type: "success",
      duration: 5000
    });
    sessionStorage.removeItem("results");
  };

  return null; 
}
