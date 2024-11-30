import { QuizType } from "@/app/typings/quiz_type";
import SelectOption from "@/components/core/SelectOption/SelectOption";
import { FormControl } from "@chakra-ui/form-control";
import { createListCollection, Flex, Input } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";

interface IQuizDetailsFormProps {
  quizTypes: QuizType[];
}

export default function QuizDetailsForm({ quizTypes }: IQuizDetailsFormProps) {
  const { register, trigger, control } = useFormContext();

  const types = createListCollection({
    items: quizTypes.map((quizType: QuizType) => ({
      value: quizType.id,
      label: quizType.type_name,
    })),
  });

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
      <Controller
        name="quiz_type"
        control={control}
        rules={{
          required: true,
        }}
        render={({ field }) => (
          <SelectOption
            field={{
              ...field,
              value: field.value || [],
            }}
            list={types}
            defaultMessage="Select quiz type"
          />
        )}
      />
    </Flex>
  );
}
