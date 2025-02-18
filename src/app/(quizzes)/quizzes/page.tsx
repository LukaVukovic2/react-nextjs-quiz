import SessionResults from "@/components/core/SessionResults/SessionResults";
import { ToasterWrapper } from "@/components/core/ToasterWrapper/ToasterWrapper";
import Homepage from "@/components/shared/Homepage/Homepage";
import { createClient } from "@/components/shared/utils/supabase/server";

import { notFound } from "next/navigation";

interface IQuizListPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function Home({
  searchParams,
}: IQuizListPageProps) {
  const supabase = await createClient();
  const { data: types, error } = await supabase.rpc("get_quiz_types");

  const message = searchParams?.confirmed === "true" ? "Email confirmed" : "";

  if (error || !types || !types.length) notFound();

  return (
    <>
      <Homepage types={types} />
      <ToasterWrapper
        title={message}
        type="success"
      />
      <SessionResults message={message} />
    </>
  );
}
