import SessionResults from "@/components/core/SessionResults/SessionResults";
import { ToasterWrapper } from "@/components/core/ToasterWrapper/ToasterWrapper";
import Homepage from "@/components/shared/Homepage/Homepage";
import { createClient } from "@/components/shared/utils/supabase/server";
import { notFound } from "next/navigation";

interface IQuizListPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function QuizListPage({ searchParams: params }: IQuizListPageProps) {
  const supabase = await createClient();
  const { data: types, error } = await supabase.rpc("get_quiz_types");

  const message =
    (params?.confirmed === "true" && "Email confirmed") ||
    (params?.logged_in === "true" && "Logged in") ||
    "";

  if (error || !types || !types.length) notFound();

  return (
    <>
      <Homepage types={types} />
      <ToasterWrapper title={message} type="success"/>
      <SessionResults message={message} />
    </>);
}