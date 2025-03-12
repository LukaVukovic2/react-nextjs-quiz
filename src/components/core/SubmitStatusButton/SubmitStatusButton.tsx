import { useFormStatus } from "react-dom";
import { SubmitButton } from "../SubmitButton/SubmitButton";

interface ISubmitStatusButtonProps {
  loadingText: string;
  children: React.ReactNode;
}

export const SubmitStatusButton = ({loadingText, children}: ISubmitStatusButtonProps) => {
  const { pending } = useFormStatus();
  return (
    <SubmitButton
      loading={pending}
      disabled={pending}
      loadingText={loadingText}
    >
      {children}
    </SubmitButton>
  );
}