import { FormControl } from "@chakra-ui/form-control";
import { Flex, Input } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

export default function QuizDetailsForm() {
  const { register, trigger } = useFormContext();
  return (
    <Flex
      gap={5}
      flexDir="column"
    >
      <FormControl>
        <Input
          placeholder="Title"
          {...register("title", { required: true })}
          onBlur={() => trigger("title")}
        />
      </FormControl>
      <FormControl>
        <Input
          placeholder="Time (in seconds)"
          {...register("time", { required: true })}
          type="number"
          onBlur={() => trigger("time")}
        />
      </FormControl>
      <FormControl>
        <Input
          placeholder="Category"
          {...register("category", { required: true })}
          onBlur={() => trigger("category")}
        />
      </FormControl>
    </Flex>
  );
}
