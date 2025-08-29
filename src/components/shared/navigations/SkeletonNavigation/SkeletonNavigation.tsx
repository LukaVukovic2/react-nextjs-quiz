import { Flex, SkeletonText } from "@chakra-ui/react";

export default function SkeletonNavigation() {
  return (
    <Flex
      m={2}
      flex={1}
    >
      <SkeletonText
        noOfLines={1}
        flex={1}
      />
      <SkeletonText
        noOfLines={1}
        flex={1}
        width="85px"
        alignSelf="flex-end"
      />
    </Flex>
  );
}