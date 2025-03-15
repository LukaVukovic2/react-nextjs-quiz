import { Flex, Slider } from "@chakra-ui/react";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

interface ISliderInputProps {
  field: ControllerRenderProps<FieldValues, string>;
  thumbIcon: JSX.Element;
}

export default function SliderInput({field, thumbIcon}: ISliderInputProps) {
  return (
    <Slider.Root
      width="200px"
      colorPalette="blue"
      defaultValue={[3]}
      min={1}
      max={5}
      step={1}
      onValueChange={({ value }) => field.onChange(value[0])}
      my={5}
    >
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumb
          index={0}
          boxSize={8}
          as={Flex}
          gap="2px"
        >
          <div>
            {field.value} 
          </div>
          <div>
            {thumbIcon}
          </div>
        </Slider.Thumb>
      </Slider.Control>
    </Slider.Root>
  );
};