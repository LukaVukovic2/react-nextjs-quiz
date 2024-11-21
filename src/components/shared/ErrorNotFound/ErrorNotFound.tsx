"use client";
import { Center, Flex, Heading, Text } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { revalidateCache } from "../utils/actions/revalidateCache";

export default function ErrorNotFound({
  error,
  isFound,
}: {
  error: string;
  isFound?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = async () => {
    await revalidateCache(pathname);
    router.push("/");
  };

  return (
    <Center
      height={300}
      as={Flex}
      direction="column"
      gap={5}
    >
      {isFound && (
        <Text
          fontSize="4xl"
          color="grey"
        >
          404
        </Text>
      )}
      <Heading
        as="h1"
        size="lg"
      >
        {error}
      </Heading>
      <Button onClick={handleClick}>
        {pathname !== "/quizzes" ? "Back to home" : "Try again"}
      </Button>
    </Center>
  );
}
