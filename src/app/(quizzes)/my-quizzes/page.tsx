import MyQuizzes from "@/components/features/quizzes/MyQuizzes/MyQuizzes";
import { getUser } from "@/components/shared/utils/actions/user/getUser";
import createClient from "@/components/shared/utils/createClient";
import { notFound } from "next/navigation";

export default async function MyQuizzesPage() {
  const supabase = createClient();
  const { data: { user } } = await getUser();
  if (!user) {
    return null;
  }  
  const { data: quizzes, error } = await supabase.rpc("get_quizzes_by_id", {
    iduser: user.id,
  });
  if(!quizzes || !(Array.isArray(quizzes) && quizzes.length > 0) || error) {
    notFound();
  }
  return <MyQuizzes quizzes={quizzes} />;
}
