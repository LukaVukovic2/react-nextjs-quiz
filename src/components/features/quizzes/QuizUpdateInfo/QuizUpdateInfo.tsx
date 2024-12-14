import { Quiz } from "@/app/typings/quiz";
import { QuizType } from "@/app/typings/quiz_type";
import SelectOption from "@/components/core/SelectOption/SelectOption";
import { QuizUpdateContext } from "@/components/shared/utils/contexts/QuizUpdateContext";
import { formatToMMSS } from "@/components/shared/utils/formatTime";
import { timeOptions } from "@/components/shared/utils/timeOptions";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, ListCollection } from "@chakra-ui/react";
import debounce from "debounce";
import { useContext } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface IQuizUpdateInfoProps {
  quiz: Quiz;
  quizType: QuizType;
  quizTypes: ListCollection;
}

export default function QuizUpdateInfo({ quiz, quizType, quizTypes }: IQuizUpdateInfoProps) {
  const { register, control } = useFormContext();
  const { setDirtyQuizFields } = useContext(QuizUpdateContext);

  const updateQuizInfo = (title: string) => {
    setDirtyQuizFields((prev) => ({...prev, id: quiz.id, title}) as Quiz);
  };

  const changeTime = (time: string) => {
    setDirtyQuizFields((prev) => ({...prev, id: quiz.id, time}) as Quiz);
  };

  const selectQuizType = (value: string) => {
    setDirtyQuizFields((prev) => ({...prev, id: quiz.id, id_quiz_type: value}) as Quiz);
  };

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
            onChange: debounce((e) => updateQuizInfo(e), 500),
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
                  onChange: (e) => selectQuizType(e[0]),
                }}
                list={quizTypes}
                defaultMessage={quizType ? quizType.type_name : "Select quiz type"}
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
                value: formatToMMSS(+quiz.time)|| "",
                onChange: (e) => changeTime(e[0]),
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