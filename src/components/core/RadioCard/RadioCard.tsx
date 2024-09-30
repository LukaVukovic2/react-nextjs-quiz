import { Box, useRadio } from "@chakra-ui/react";

export const RadioCard = (props: any) => {
  const { getInputProps, getRadioProps } = useRadio(props);
  const input = getInputProps();
  const checkbox = getRadioProps();

  const isCorrect = props.answer?.correct_answer && props.selectedAnsId === props.answer.id;

  return (
    <Box as="label">
      <input {...input} disabled={props.isFinished} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        bg={
          props.isFinished && props.answer?.correct_answer
            ? "green.200"
            : undefined
        }
        _checked={{
          bg: props.isFinished
            ? isCorrect
              ? "green.200"
              : "red.400"
            : "teal.600"
        }}
        _focus={{
          boxShadow: "outline",
        }}
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  );
};
