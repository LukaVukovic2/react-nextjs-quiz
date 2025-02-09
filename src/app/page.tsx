"use client";
import AuthForm from "@/components/shared/AuthForm/AuthForm";
import { createClient } from "@/components/shared/utils/supabase/client";
import { Button } from "@/styles/theme/components/button";
import { Heading } from "@/styles/theme/components/heading";
import { Container, Flex } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { setCookie } from 'cookies-next';

export default function Home() {
  const router = useRouter();
  const supabase = createClient();
  const handleSignInGuest = async () => {
    const { error } = await supabase.auth.signInAnonymously();
    if (error) {
      console.error("Error signing in as guest:", error.message);
    } else {
      setCookie("isAnonymous", "true");
      router.replace("/quizzes");
    }
  };
  return (
    <Container
      maxW="xl"
      as={Flex}
      flexDirection="column"
      gap={4}
    >
      <Heading
        as="h1"
        size="h1"
      >
        Hello!
      </Heading>
      <AuthForm />
      <div>
        <Button onClick={() => handleSignInGuest()}>Continue as guest</Button>
      </div>
    </Container>
  );
}
