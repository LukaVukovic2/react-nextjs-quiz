import QuizTabs from "@/components/shared/QuizTabs/QuizTabs";

export default async function QuizPage({params}: {params: { id: string };}) {
  const { id } = params;
  return <QuizTabs id={id} />;
}
