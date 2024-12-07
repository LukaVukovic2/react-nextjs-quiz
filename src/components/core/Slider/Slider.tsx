import {
  Box,
  Input,
} from "@chakra-ui/react";
import { Slider } from "@/components/ui/slider";
import { forwardRef } from "react";

interface ISliderInputProps {
  value: string;
  onChange: (value: number) => void;
  name: string;
}

export const SliderInput = forwardRef<HTMLInputElement, ISliderInputProps>((props, ref) => {
  return (
    <Box py={4}>
      <Input name={props.name} type="hidden" value={props.value} ref={ref} />
      <Slider
        variant="outline"
        cursor="grab"
        colorPalette="cyan"
        label="Rating"
        value={[Number(props.value) || 0]}
        defaultValue={[3]}
        min={1}
        max={5}
        onValueChange={({value}) => props.onChange(value[0])}
      >
      </Slider>
    </Box>
  )
});

SliderInput.displayName = "SliderInput";
