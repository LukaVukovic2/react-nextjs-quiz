"use server";
import MyQuizzes from "@/components/features/quizzes/MyQuizzes/MyQuizzes";
import { createClient } from "@/components/shared/utils/createClient";

const supabase = createClient();

export default async function MyQuizzesPage() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }
  
  const { data: quizzes } = await supabase.rpc("get_quizzes_by_id", {
    iduser: user.id,
  });

  return (
    <>
      <h1>My Quizzes</h1>
      {quizzes.length > 0 ? 
        <MyQuizzes quizzes={quizzes} /> : 
        <p>No quizzes found</p>
      }
    </>
  );
}
