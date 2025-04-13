"use client";
import ErrorDefault from "@/components/shared/utilities/ErrorDefault/ErrorDefault";

export default function Error({ reset }: { reset: () => void }) {
  return <ErrorDefault reset={reset} />;
}
