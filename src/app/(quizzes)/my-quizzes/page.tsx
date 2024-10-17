"use server";
import MyQuizzes from "@/components/features/quizzes/MyQuizzes/MyQuizzes";
import createClient from "@/components/shared/utils/createClient";
import { Heading } from "@chakra-ui/react";
import { notFound } from "next/navigation";

export default async function MyQuizzesPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }
  
  const { data: quizzes } = await supabase.rpc("get_quizzes_by_idf", {
    iduser: user.id,
  });

  if(!quizzes || !(Array.isArray(quizzes) && quizzes.length > 0)) {
    notFound();
  }

  return (
    <>
      <Heading as="h1" size="md">My Quizzes</Heading>
      <MyQuizzes quizzes={quizzes} />
    </>
  );
}
