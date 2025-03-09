import { QuizType } from "@/app/typings/quiz_type";
import SelectOption from "@/components/core/SelectOption/SelectOption";
import { formatToMMSS } from "@/components/shared/utils/formatTime";
import { timeOptions } from "@/components/shared/utils/timeOptions";
import { FormControl } from "@chakra-ui/form-control";
import { createListCollection, Flex, Input } from "@chakra-ui/react";
import debounce from "debounce";
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
          onChange={debounce((e) =>{
            register("title").onChange(e);
            trigger("title");
          }, 500)}
        />
      </FormControl>
      <FormControl>
        <Controller
          name="time"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <SelectOption
              field={{
                ...field,
                onChange: (e) => field.onChange(e[0]),
              }}
              list={timeOptions}
              defaultMessage={field.value ? formatToMMSS(field.value) : "Select time"}
            />
          )}
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