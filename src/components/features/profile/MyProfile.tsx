"use client";
import { deleteAvatar } from "@/components/shared/utils/actions/avatar/deleteAvatar";
import { fetchAvatar } from "@/components/shared/utils/actions/avatar/fetchAvatar";
import { uploadAvatar } from "@/components/shared/utils/actions/avatar/uploadAvatar";
import { updateUsername } from "@/components/shared/utils/actions/updateUsername";
import { DeleteIcon } from "@chakra-ui/icons";
import { Button, Card, CardBody, Flex, FormLabel, Heading, Input, Spinner } from "@chakra-ui/react";
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getAvatar() {
      await fetchAvatar(id);
    }
    getAvatar();
  }, [id]);

  const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setIsLoading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("id", id);
    await uploadAvatar(formData);
    setIsLoading(false);
  };

  const handleUsernameUpdate = async (e: ChangeEvent<HTMLInputElement>) => {
    const formData = new FormData();
    formData.append("username", e.target.value);
    formData.append("id", id);

    await updateUsername(formData);
  };

  return (
    <Flex
      flexDir="column"
      gap={2}
      align="center"
      mt={8}
    >
      <Card>
        <CardBody border="1px solid grey">
          <Heading as="h1" size="lg">My Profile</Heading>
          <div>
            <FormLabel>Username:</FormLabel>
            <Input
              type="text"
              defaultValue={profile?.username}
              onBlur={(e) => handleUsernameUpdate(e)}
            />
          </div>

          {isLoading ? (
            <Spinner
              thickness="4px"
              speed="0.65s"
              size="xl"
            />
          ) : (
            <>
              <Image
                style={{ borderRadius: "50%", width: "100px", height: "100px" }}
                src={
                  profile.avatar
                    ? profile.avatar
                    : "https://fakeimg.pl/100x100/"
                }
                alt="profile avatar"
                width={100}
                height={100}
                priority={true}
              />
            </>
          )}
          <Flex
            gap={2}
            align="baseline"
          >
            {profile.avatar && (
              <Button
                onClick={() => deleteAvatar(profile.avatar)}
                colorScheme="red"
              >
                <DeleteIcon />
              </Button>
            )}
            <Input
              type="file"
              onChange={(e) => handleAvatarUpload(e)}
              border={0}
            />
          </Flex>
        </CardBody>
      </Card>
    </Flex>
  );
}
