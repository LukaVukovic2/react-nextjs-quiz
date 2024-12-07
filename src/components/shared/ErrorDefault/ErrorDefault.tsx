import { Center, Flex } from "@chakra-ui/react";
import { Heading } from "@/styles/theme/components/heading";
import { Button } from "@/styles/theme/components/button";

export default function ErrorDefault({reset}: {reset: () => void}) {
  return (
    <Center height={300} as={Flex} flexDirection="column" gap={5}>
      <Heading
        as="h1"
        size="h1"
      >
        Something went wrong...
      </Heading>
      <Button
        onClick={reset}
      >
        Try again
      </Button>
    </Center>
  );
}
