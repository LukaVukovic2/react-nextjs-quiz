import { formatToMMSS } from "@/components/shared/utils/formatTime";
import { DialogBody, DialogContent, DialogRoot } from "@/components/ui/dialog";
import { Button } from "@/styles/theme/components/button";
import { Flex, HStack, StackSeparator, Text } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

interface IQuizPauseModalProps {
  isPaused: boolean;
  setIsPaused: Dispatch<SetStateAction<boolean>>;
  title: string;
}

export default function QuizPauseModal({
  isPaused,
  setIsPaused,
  title,
}: IQuizPauseModalProps) {
  const params = useSearchParams();
  const timeLeft = params.get("timeLeft");
  return (
    <DialogRoot
      open={isPaused}
      onOpenChange={(e) => setIsPaused(e.open)}
      size="full"
      placement="center"
      motionPreset="slide-in-bottom"
    >
      <DialogContent
        as={Flex}
        justifyContent="center"
        height="100vh"
      >
        <DialogBody
          as={Flex}
          alignItems="center"
          flexDirection="column"
          gap={5}
        >
          <HStack
            separator={<StackSeparator />}
            fontSize="lg"
            fontWeight="bold"
            border={1}
          >
            <Text textTransform="uppercase" color="danger.400">Quiz paused</Text>
            <Text>{title}</Text>
            <Text textTransform="uppercase">
              {timeLeft ? formatToMMSS(+timeLeft) + " remaining" : ""}
            </Text>
          </HStack>
          <Button
            onClick={() => setIsPaused(false)}
            type="button"
          >
            Resume
          </Button>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
}
