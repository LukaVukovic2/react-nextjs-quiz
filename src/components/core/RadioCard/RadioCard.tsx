import { Answer } from "@/app/typings/answer";
import { Box, InputProps, useRadio } from "@chakra-ui/react";

interface IRadioCardProps extends Omit<InputProps, 'value'> {
  answer: Answer;
  isFinished: boolean;
  selectedAnsId: string;
}

export const RadioCard = (props: IRadioCardProps) => {
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
