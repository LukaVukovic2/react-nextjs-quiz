import { PasswordStrengthMeter } from "@/components/ui/password-input";
import { FieldValues, useWatch, Control } from "react-hook-form";
import zxcvbn from "zxcvbn";

interface IPasswordStrengthWrapperProps {
  isShown: boolean;
  control: Control<FieldValues, string>;
}

export const PasswordStrengthWrapper = ({isShown, control}: IPasswordStrengthWrapperProps) => {
  const password = useWatch({control, name: "password", defaultValue: ""});
  const strengthVal = !isShown ? zxcvbn(password)?.score : 0;
  return (
    <PasswordStrengthMeter
      value={strengthVal}
      maxWidth="200px"
      width="100%"
    />
  );
};