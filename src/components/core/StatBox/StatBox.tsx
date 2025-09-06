import { Flex, Stat } from "@chakra-ui/react";
import { ReactNode } from "react";

interface IStatBox {
  title: string;
  value: string | number;
  children?: ReactNode;
}

export default function StatBox({ title, value, children }: IStatBox) {
  return (
    <Stat.Root
      as={Flex}
      justifyContent="center"
      size={{ base: "sm", md: "lg" }}
    >
      <Stat.Label>{title}</Stat.Label>
      <Stat.ValueText>
        <Flex
          alignItems="center"
          gap={2}
        >
          {children}
          {value}
        </Flex>
      </Stat.ValueText>
    </Stat.Root>
  );
}
