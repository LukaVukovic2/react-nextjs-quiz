import ErrorNotFound from "@/components/shared/ErrorNotFound/ErrorNotFound";
import { Button } from "@/styles/theme/components/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <ErrorNotFound
      title="Quiz not found"
      description="Try again later if error persists"
    >
      <Link href="/quizzes">
        <Button visual="outline">Return home</Button>
      </Link>
    </ErrorNotFound>
  );
}
