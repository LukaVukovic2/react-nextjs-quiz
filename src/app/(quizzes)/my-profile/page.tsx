import MyProfile from "@/components/features/profile/MyProfile";
import { getUser } from "@/components/shared/utils/actions/user/getUser";
import { createClient } from "@/components/shared/utils/supabase/server";
import { notFound } from "next/navigation";

export default async function MyProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await getUser();
  const { data: profile } = await supabase.rpc("get_user_data", { userid: user?.id });

  if(!profile || !user) notFound();

  return <MyProfile id={user.id} profile={profile} />;
}