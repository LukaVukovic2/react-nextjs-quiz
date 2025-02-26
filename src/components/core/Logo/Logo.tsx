import { Image, ImageProps } from "@chakra-ui/react";

export const Logo = (props: ImageProps) => {
  return (
    <Image
      src="/logo.svg"
      alt="logo"
      {...props}
    />
  );
};