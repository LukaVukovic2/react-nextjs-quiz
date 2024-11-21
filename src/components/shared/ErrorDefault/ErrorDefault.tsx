import { Center, Flex, Heading } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";

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
        colorPalette="blue"
        variant="outline"
      >
        Try again
      </Button>
    </Center>
  );
}
