import MyProfile from "@/components/features/profile/MyProfile";
import { createClient } from "@/components/shared/utils/createClient";

export default async function MyProfilePage() {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from('profile').select('*').eq('id', user?.id).single();

  return user?.id && <MyProfile id={user.id} profile={profile} />;
}