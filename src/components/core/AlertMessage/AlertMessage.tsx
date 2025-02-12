"use client";
import { Alert } from "@chakra-ui/react";

interface IAlertMessageProps {
  title: string;
  status: "success" | "error" | "warning" | "info";
}

export default function AlertMessage({ title, status }: IAlertMessageProps) {
  return (
    <Alert.Root status={status}>
      <Alert.Indicator />
      <Alert.Title>{title}</Alert.Title>
    </Alert.Root>
  );
}
