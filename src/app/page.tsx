'use client';
import AuthForm from "@/components/shared/AuthForm/AuthForm";
import { Heading } from "@/styles/theme/components/heading";

export default function Home() {
  return (
    <div>
      <Heading as="h1" size="h1">Hello!</Heading>
      <AuthForm />
    </div>
  )
}
