import SessionResults from "@/components/core/SessionResults/SessionResults";
import { ToasterWrapper } from "@/components/core/ToasterWrapper/ToasterWrapper";
import Homepage from "@/components/shared/Homepage/Homepage";
import { createClient } from "@/components/shared/utils/supabase/server";
import { notFound } from "next/navigation";

export default async function QuizListPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const supabase = await createClient();
  const { data: types, error } = await supabase.rpc("get_quiz_types");

  const { confirmed, logged_in } = searchParams || {};
  let message = "";
  if (confirmed === "true") {
    message = "Email confirmed";

  }
  if (logged_in === "true") {
    message = "Logged in";
  }

  if (error || !types || !types.length) notFound();

  return (
    <>
      <Homepage types={types} />
      <ToasterWrapper title={message} type="success"/>
      <SessionResults message={message} />
    </>);
}