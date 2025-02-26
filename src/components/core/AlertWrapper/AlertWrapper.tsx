"use client";
import { Alert } from "@chakra-ui/react";

interface IAlertWrapperProps {
  title: string;
  status: "success" | "error" | "warning" | "info";
}

export default function AlertWrapper({ title, status }: IAlertWrapperProps) {
  return (
    <Alert.Root status={status}>
      <Alert.Indicator />
      <Alert.Title>{title}</Alert.Title>
    </Alert.Root>
  );
}
