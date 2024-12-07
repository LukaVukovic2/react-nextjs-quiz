import ErrorNotFound from "@/components/shared/ErrorNotFound/ErrorNotFound";
import { Button } from "@/styles/theme/components/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <ErrorNotFound
      title="No quizzes yet"
      description="It looks like you haven't created any quizzes yet. Why not start your first quiz now?"
    >
      <Link href="/quizzes/new">
        <Button visual="outline">Create Quiz</Button>
      </Link>
    </ErrorNotFound>
  );
}