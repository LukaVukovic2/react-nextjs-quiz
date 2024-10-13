import {
  forwardRef,
  Box,
  Slider,
  SliderMark,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Input,
  InputProps,
} from "@chakra-ui/react";
import { ChangeEvent } from "react";

export const SliderInput = forwardRef((input: InputProps, ref) => {
  const value = Number(input.value) || 3;

  return (
    <Box py={4}>
      <Input name={input.name} type="hidden" value={value} ref={ref} />
      <Slider
        aria-label="slider-ex-6"
        value={value}
        min={1}
        max={5}
        onChange={(val) => {
          const event = {
            target: { value: "" + val }
          } as ChangeEvent<HTMLInputElement>;
          input.onChange?.(event);
        }}
      >
        <SliderMark value={1}>1</SliderMark>
        <SliderMark value={5}>5</SliderMark>
        <SliderMark
          value={value}
          textAlign="center"
          bg="blue.500"
          color="white"
          mt="-10"
          ml="-5"
          w="12"
        >
          {value}
        </SliderMark>
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
    </Box>
  );
});
