import {
  forwardRef,
  Box,
  Slider,
  SliderMark,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Input,
} from "@chakra-ui/react";

export const SliderInput = forwardRef(({ value, onChange, name }, ref) => (
  <Box py={4}>
    <Input name={name} type="hidden" value={value} ref={ref} />
    <Slider
      aria-label="rating-slider"
      value={value}
      min={1}
      max={5}
      onChange={onChange}
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
));
