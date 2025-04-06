import QuizList from "@/components/features/quizzes/QuizList/QuizList";
import { createClient } from "@/utils/supabase/server";
import { Heading } from "@chakra-ui/react";
import { notFound } from "next/navigation";

interface ITypePageProps {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function TypePage({params, searchParams}: ITypePageProps) {
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
