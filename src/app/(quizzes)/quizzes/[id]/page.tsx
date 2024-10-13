import QuizTabs from "@/components/shared/QuizTabs/QuizTabs";
import createClient from "@/components/shared/utils/createClient";

export default async function QuizPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { id } = params;
  const page = searchParams?.page as string;

  const supabase = createClient();
  const { data: quiz } = await supabase
    .from("quiz")
    .select("*")
    .eq("id", id)
    .single();

  return quiz ? (
    <QuizTabs quiz={quiz} page={page} />
  ) : (
    <div>Quiz not found</div>
  );
}
