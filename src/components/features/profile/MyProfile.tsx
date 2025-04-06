"use client";
import { Card, Flex, Float, Input, chakra, Image, Container } from "@chakra-ui/react";
import { updateUserData } from "@/utils/actions/user/updateUserData";
import { toaster } from "@/components/ui/toaster";
import { FormLabel } from "@chakra-ui/form-control";
import {
  FileInput,
  FileUploadClearTrigger,
  FileUploadLabel,
  FileUploadRoot,
} from "@/components/ui/file-button";
import { InputGroup } from "@/components/ui/input-group";
import { LuFileUp } from "react-icons/lu";
import { CloseButton } from "@/components/ui/close-button";
import { SubmitStatusButton } from "@/components/core/SubmitStatusButton/SubmitStatusButton";

interface IMyProfileProps {
  id: string;
  profile: {
    username: string;
    avatar: string;
  };
}

export default function MyProfile({ id, profile }: IMyProfileProps) {
  const handleSubmit = async (data: FormData) => {
    const success = await updateUserData(data);

    toaster.create({
      title: success ? "Profile updated" : "Failed to update profile",
      type: success ? "success" : "error",
      duration: 3000,
    })
  };

  return (
    <chakra.form
      action={handleSubmit}
    >
      <Container
        maxW="xl"
      >
        <Card.Root
          mt="75px"
          position="relative"
          rounded="soft"
          bg="primary"
          color="primaryContrast"
          boxShadow="8px 8px 10px var(--chakra-colors-light-600)"
          border="none"
        >
          <Card.Body
            p={12}
          >
            <Float
              asChild
              placement="top-center"
            >
              <Image
                src={profile?.avatar || "https://fakeimg.pl/100x100/"}
                alt="profile avatar"
                width={100}
                height={100}
                rounded="full"
              />
            </Float>
            <Flex
              flex={1}
              flexDirection="column"
              gap={8}
            >
              <div>
                <FormLabel>Username:</FormLabel>
                <Input
                  type="text"
                  name="username"
                  defaultValue={profile?.username}
                  bg="light.100"
                />
              </div>

              <Flex
                gap={2}
                align="baseline"
              >
                <FileUploadRoot
                  gap="1"
                  maxWidth="300px"
                  name="avatar"
                  color="primaryContrast"
                >
                  <FileUploadLabel>Upload avatar</FileUploadLabel>
                  <InputGroup
                    borderColor="{colors.primaryContrast}"
                    w="full"
                    startElement={<LuFileUp />}
                    endElement={
                      <FileUploadClearTrigger asChild>
                        <CloseButton
                          me="-1"
                          size="xs"
                          pointerEvents="auto"
                        />
                      </FileUploadClearTrigger>
                    }
                  >
                    <FileInput bg="light.100" cursor="pointer" />
                  </InputGroup>
                </FileUploadRoot>
              </Flex>
              <input
                type="hidden"
                name="id"
                value={id}
              />
              <SubmitStatusButton
                loadingText="Updating..."
              >
                Save Changes
              </SubmitStatusButton>
            </Flex>
          </Card.Body>
        </Card.Root>
      </Container>
    </chakra.form>
  );
}