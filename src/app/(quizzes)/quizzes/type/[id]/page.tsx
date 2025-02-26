import QuizList from "@/components/features/quizzes/QuizList/QuizList";
import { createClient } from "@/components/shared/utils/supabase/server";
import { Heading } from "@chakra-ui/react";
import { notFound } from "next/navigation";

export default async function TypePage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { id } = params;
  const supabase = await createClient();
  const { data: quizzes, error } = await supabase.rpc("get_quizzes_by_type", {
    id_type: id,
  });
  if (!quizzes || !quizzes.length || error) notFound();
  return (
    <QuizList
      quizzes={quizzes}
    >
      <Heading as="h1" size="4xl">
        {searchParams?.name}  
      </Heading>
    </QuizList>
  );
}
