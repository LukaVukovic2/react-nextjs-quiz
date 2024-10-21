import { Flex, Spinner, Text } from "@chakra-ui/react";

export default function LoadingSpinner({text}: {text: string}) {
  return (
    <Flex gap={2} alignItems="center" justifyContent="center" width="100%" height="100%" flex={1}>
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
      <Text fontSize="xl">
        {text}
      </Text>
    </Flex>
  );
}
