'use client';
import AuthForm from "@/components/shared/AuthForm/AuthForm";
import { Heading } from "@chakra-ui/react";

export default function Home() {
  return (
    <div>
      <Heading as="h1" size="lg">Hello!</Heading>
      <AuthForm />
    </div>
  )
}
