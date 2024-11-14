"use client";
import {
  Button,
  Card,
  CardBody,
  Flex,
  FormLabel,
  Heading,
  Input,
  useToast,
} from "@chakra-ui/react";
import Image from "next/image";
import { updateUserData } from "@/components/shared/utils/actions/user/updateUserData";
import { useRef } from "react";

interface IMyProfileProps {
  id: string;
  profile: {
    username: string;
    avatar: string;
  };
}

export default function MyProfile({ id, profile }: IMyProfileProps) {
  const toast = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(formRef.current || undefined);
    const success = await updateUserData(formData);

    if (success) {
      toast({
        title: "Profile updated",
        status: "success",
        duration: 3000,
      });
      formRef.current?.reset();
    } else {
      toast({
        title: "Failed to update profile",
        status: "error",
        duration: 3000,
      });
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <Flex
        flexDir="column"
        gap={2}
        align="center"
        mt={8}
      >
        <Card>
          <CardBody border="1px solid grey">
            <Heading
              as="h1"
              size="lg"
            >
              My Profile
            </Heading>
            <div>
              <FormLabel>Username:</FormLabel>
              <Input
                type="text"
                name="username"
                defaultValue={profile?.username}
              />
            </div>

            <Image
              style={{ borderRadius: "50%", width: "100px", height: "100px" }}
              src={
                profile.avatar || "https://fakeimg.pl/100x100/"
              }
              alt="profile avatar"
              width={100}
              height={100}
              priority={true}
            />
            
            <Flex
              gap={2}
              align="baseline"
            >
              <Input
                type="file"
                name="avatar"
                border={0}
              />
            </Flex>
            <input type="hidden" name="id" value={id} />
            <Button type="submit">Save Changes</Button>
          </CardBody>
        </Card>
      </Flex>
    </form>
  );
}