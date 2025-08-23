import ErrorNotFound from "@/components/shared/utilities/ErrorNotFound/ErrorNotFound";
import { Button } from "@/styles/theme/components/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <ErrorNotFound
      title="Quiz type not found"
      description="Try some other quiz type"
    >
      <Link href="/quizzes">
        <Button visual="outline">Return home</Button>
      </Link>
    </ErrorNotFound>
  );
}
