"use client";
import ErrorDefault from "@/components/shared/ErrorDefault/ErrorDefault";

export default function Error({reset}: {reset: () => void;}) {
  return <ErrorDefault reset={reset}/>
}