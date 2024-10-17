import { Button, Center, Flex, Heading } from "@chakra-ui/react";

export default function ErrorDefault({reset}: {reset: () => void}) {
  return (
    <Center height={300} as={Flex} direction="column" gap={5}>
      <Heading
        as="h1"
        size="lg"
      >
        Something went wrong...
      </Heading>
      <Button
        onClick={reset}
        colorScheme="blue"
        variant="outline"
      >
        Try again
      </Button>
    </Center>
  );
}
