import { CheckCircleIcon, MinusIcon } from "@chakra-ui/icons";
import { Box, useRadio } from "@chakra-ui/react";

export default function RadioCard(props: any) {
  const { getInputProps, getRadioProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as="label">
      <input {...input} disabled={props.isFinished} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        bg={(props.isFinished && (props.answer?.correct_answer || props.isCorrect)) && "green.200"}
        _checked={{
          bg: props.isFinished ? (props.isCorrect ? "green.200" : "red.400") : "teal.600",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        px={5}
        py={3}
      >
        {props.children}
        {(props.isFinished && props.isCorrect) && <CheckCircleIcon ml={2} />}
        {(props.isFinished && !props.isCorrect && (props.answer.id === props.selectedAnsId)) && <MinusIcon ml={2} />}
      </Box>
    </Box>
  );
}
