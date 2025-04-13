"use client";
import { TbError404Off } from "react-icons/tb";
import { EmptyState } from "@/components/ui/empty-state";

export default function ErrorNotFound({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <EmptyState
      icon={<TbError404Off />}
      title={title}
      description={description}
    >
      {children}
    </EmptyState>
  );
}