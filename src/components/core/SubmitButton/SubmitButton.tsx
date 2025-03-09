import { Button, ButtonProps } from "@chakra-ui/react";

export const SubmitButton= (props: ButtonProps) => {
  return (
    <Button type="submit" {...props}>
      {props.children}
    </Button>
  );
};