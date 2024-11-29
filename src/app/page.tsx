'use client';
import AuthForm from "@/components/shared/AuthForm/AuthForm";
import { Heading } from "@/styles/theme/components/heading";
import { Container } from "@chakra-ui/react";

export default function Home() {
  return (
    <Container maxW="xl">
      <Heading as="h1" size="h1">Hello!</Heading>
      <AuthForm />
    </Container>
  )
}
