import CookieDataChecker from "@/components/core/CookieDataChecker/CookieDataChecker";
import { ToasterWrapper } from "@/components/core/ToasterWrapper/ToasterWrapper";
import HomeLayout from "@/components/shared/HomeLayout/HomeLayout";
import { createClient } from "@/utils/supabase/server";
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
      <HomeLayout types={types} />
      <ToasterWrapper
        title={message}
        type="success"
      />
      <CookieDataChecker />
    </>
  );
}
