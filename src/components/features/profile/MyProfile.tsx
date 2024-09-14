"use client";
import { fetchAvatar } from "@/components/shared/utils/fetchAvatar";
import { uploadAvatar } from "@/components/shared/utils/uploadAvatar";
import { Input, Spinner } from "@chakra-ui/react";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";

interface IMyProfileProps {
  id: string;
  profile: {
    username: string;
    avatar: string;
  };
}

export default function MyProfile({ id, profile }: IMyProfileProps) {
  const [avatar, setAvatar] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getAvatar() {
      const name = await fetchAvatar(id);
      const url = `https://yihokqocgijpqfemclfy.supabase.co/storage/v1/object/public/avatars/${id}/${name}`;
      setAvatar(url);
    };
    getAvatar();
  }, []);

  const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setIsLoading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("id", id);
    const data = await uploadAvatar(formData);
    const url = `https://yihokqocgijpqfemclfy.supabase.co/storage/v1/object/public/avatars/${data.path}`;
    setAvatar(url);
    setIsLoading(false);
  };

  return (
    <div>
      <h1>My Profile</h1>
      <p>{profile?.username}</p>
      {isLoading ? (
        <Spinner
          thickness="4px"
          speed="0.65s"
          size="xl"
        />
      ): 
        <Image
          style={{ borderRadius: "50%" }}
          src={avatar ? avatar : "https://fakeimg.pl/100x100/"}
          alt="profile avatar"
          width={100}
          height={100}
          priority={true}
        />
      }
      <Input
        type="file"
        onChange={(e) => handleAvatarUpload(e)}
      />
    </div>
  );
}
