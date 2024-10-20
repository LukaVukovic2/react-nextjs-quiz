import ErrorNotFound from "@/components/shared/ErrorNotFound/ErrorNotFound";

export default function NotFound() {
  return <ErrorNotFound error="Quiz not found" isFound={true} />;
}