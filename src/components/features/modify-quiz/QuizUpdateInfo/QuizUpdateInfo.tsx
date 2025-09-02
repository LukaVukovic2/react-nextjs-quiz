import { QuizBasic, QuizType } from "@/typings/quiz";
import SelectOption from "@/components/core/SelectOption/SelectOption";
import { formatToMMSS } from "@/utils/functions/formatTime";
import { timeOptions } from "@/utils/timeOptions";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, ListCollection } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";

interface IQuizUpdateInfoProps {
  quiz: QuizBasic;
  quizType: QuizType;
  quizTypes: ListCollection;
}

export default function QuizUpdateInfo({
  quiz,
  quizType,
  quizTypes,
}: IQuizUpdateInfoProps) {
  const { register, control } = useFormContext();
  return (
    <>
      <FormControl>
        <FormLabel>Quiz title</FormLabel>
        <Input
          placeholder="Quiz Title"
          defaultValue={quiz.title}
          {...register("title", {
            required: true,
            minLength: {
              value: 3,
              message: "Title must be at least 3 characters long",
            },
          })}
        />
      </FormControl>
      {quizTypes && (
        <FormControl>
          <FormLabel>Quiz type</FormLabel>
          <Controller
            name="id_quiz_type"
            control={control}
            defaultValue={quizType.id}
            rules={{ required: true }}
            render={({ field }) => (
              <SelectOption
                field={{
                  ...field,
                  value: field.value || quizType.id || "",
                }}
                list={quizTypes}
                defaultMessage={
                  quizType ? quizType.type_name : "Select quiz type"
                }
              />
            )}
          />
        </FormControl>
      )}
      <FormControl>
        <FormLabel>Quiz playtime</FormLabel>
        <Controller
          name="time"
          control={control}
          defaultValue={quiz.time}
          rules={{ required: true }}
          render={({ field }) => (
            <SelectOption
              field={{
                ...field,
                value: formatToMMSS(+quiz.time) || "",
              }}
              list={timeOptions}
              defaultMessage={quiz.time ? formatToMMSS(+quiz.time) : "Timer"}
            />
          )}
        />
      </FormControl>
    </>
  );
}
