"use server";
import MyQuizzes from "@/components/features/quizzes/MyQuizzes/MyQuizzes";
import createClient from "@/components/shared/utils/createClient";


export default async function MyQuizzesPage() {
  const supabase = createClient();
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
      {Array.isArray(quizzes) && quizzes.length > 0 ? (
        <MyQuizzes quizzes={quizzes} />
      ) : (
        <p>No quizzes found</p>
      )}
    </>
  );
}
