import { Answer } from "@/app/typings/answer";
import { Box, InputProps, useRadio } from "@chakra-ui/react";
import clsx from "clsx";
import "./RadioCard.scss";

interface IRadioCardProps extends Omit<InputProps, 'value'> {
  answer: Answer;
  isFinished: boolean;
  selectedAnsId: string;
  isCorrect: boolean;
}

export const RadioCard = (props: IRadioCardProps) => {
  const { getInputProps, getRadioProps } = useRadio(props);
  const input = getInputProps();
  const checkbox = getRadioProps();
  const isChecked = props.selectedAnsId === props.answer.id;

  return (
    <Box as="label">
      <input {...input} disabled={props.isFinished} />
      <Box
        {...checkbox}
        className={
          clsx({
          'selected': isChecked && !props.isFinished,
          'correct': props.isFinished && props.answer?.correct_answer,
          'incorrect': isChecked && props.isFinished && !props.isCorrect,
          'focused': input.isFocused,
          'regular': true
        })}
      >     
        {props.children}
      </Box>
    </Box>
  );
};
