import MyProfile from "@/components/features/profile/MyProfile";
import createClient from "@/components/shared/utils/createClient";
import { notFound } from "next/navigation";

export default async function MyProfilePage() {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from('profile').select('*').eq('id', user?.id).single();

  if(!profile || !user) notFound();

  return <MyProfile id={user.id} profile={profile} />;
}