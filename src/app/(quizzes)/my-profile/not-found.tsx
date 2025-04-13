import ErrorNotFound from "@/components/shared/utilities/ErrorNotFound/ErrorNotFound";

export default function NotFound() {
  return (
    <ErrorNotFound
      title="Your data was not found"
      description="Please try to login again"
    />
  );
}
