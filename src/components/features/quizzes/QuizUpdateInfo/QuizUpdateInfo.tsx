import { Quiz } from "@/app/typings/quiz";
import { QuizType } from "@/app/typings/quiz_type";
import SelectOption from "@/components/core/SelectOption/SelectOption";
import { QuizUpdateContext } from "@/components/shared/utils/contexts/QuizUpdateContext";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, ListCollection } from "@chakra-ui/react";
import debounce from "debounce";
import { FocusEvent, useContext } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface IQuizUpdateInfoProps {
  quiz: Quiz;
  quizType: QuizType;
  quizTypes: ListCollection;
}

export default function QuizUpdateInfo({ quiz, quizType, quizTypes }: IQuizUpdateInfoProps) {
  const { register, control, trigger } = useFormContext();
  const { setDirtyQuizFields } = useContext(QuizUpdateContext);

  const updateQuizInfo = (
    e: FocusEvent<HTMLInputElement, Element>,
    id: string
  ) => {
    const { name, value } = e.target;

    const validateInput = trigger(name);
    if (!validateInput) return;

    setDirtyQuizFields((prev) => ({...prev, id, [name]: value}) as Quiz);
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
            onChange: (e) => updateQuizInfo(e, quiz.id),
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
                defaultMessage="Select quiz type"
              />
            )}
          />
        </FormControl>
      )}
      <FormControl>
        <FormLabel>Quiz playtime</FormLabel>
        <Input
          placeholder="Quiz playtime (HH:MM:SS)"
          defaultValue={quiz.time}
          {...register("time", {
            required: true,
            pattern: {
              value: /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/,
              message: "Invalid time format. Use HH:MM:SS",
            },
            onChange: debounce((e) => updateQuizInfo(e, quiz.id), 500),
          })}
        />
      </FormControl>
    </>
  );
}