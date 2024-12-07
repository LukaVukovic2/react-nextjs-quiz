import ErrorNotFound from "@/components/shared/ErrorNotFound/ErrorNotFound";
import { Button } from "@/styles/theme/components/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <ErrorNotFound
      title="There are no quizzes found"
      description="You can still create one by clicking the button below"
    >
      <Link href="/quizzes/new">
        <Button visual="outline">Create Quiz</Button>
      </Link>
    </ErrorNotFound>
  );
}
