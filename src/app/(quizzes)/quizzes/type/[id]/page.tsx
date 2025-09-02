import CategoryHeader from "@/components/features/category/CategoryHeader/CategoryHeader";
import QuizList from "@/components/features/category/QuizList/QuizList";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

interface ITypePageProps {
  params: { id: string };
  searchParams?: { [key: string]: string };
}

export const generateMetadata = ({ searchParams }: ITypePageProps) => {
  const { name } = searchParams as { name: string };

  return {
    title: `Quiz App - ${name}`,
    description: `Quiz App - ${name}`,
  };
};

export default async function TypePage({
  params,
  searchParams,
}: ITypePageProps) {
  const { id } = params;
  const name = searchParams?.name || "Category image";
  const supabase = await createClient();
  const { data: quizzes, error } = await supabase.rpc("get_quizzes_by_type", {
    id_type: id,
  });

  const { data: quizPlays } = await supabase.rpc("get_quizplays_by_type", {
    id_type: id,
  });

  if (!quizzes || !quizzes.length || error) notFound();
  return (
    <>
      <CategoryHeader
        categoryName={name}
        plays={quizPlays}
        quizCount={quizzes.length}
      />
      <QuizList quizzes={quizzes} />
    </>
  );
}
