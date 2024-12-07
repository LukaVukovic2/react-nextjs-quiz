import Homepage from "@/components/shared/Homepage/Homepage";
import createClient from "@/components/shared/utils/createClient";
import { notFound } from "next/navigation";

export default async function QuizListPage() {
  const supabase = createClient();
  const { data: types, error } = await supabase.rpc("get_quiz_types");

  if (error || !types || !types.length) notFound();

  return <Homepage types={types} />;
}