import { Question } from "@/app/typings/question";
import SelectOption from "@/components/core/SelectOption/SelectOption";
import { MyQuizzesContext } from "@/components/shared/utils/contexts/MyQuizzesContext";
import { Field } from "@/components/ui/field";
import { FormControl } from "@chakra-ui/form-control";
import { useContext } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface IQuestionTypeControllerProps {
  question: Question;
  selectQuestionType: (value: string, question: Question) => void;
}

export default function QuestionTypeController({ question, selectQuestionType }: IQuestionTypeControllerProps) {
  const { control } = useFormContext();
  const { questTypes } = useContext(MyQuizzesContext);
  return (
    <FormControl>
      <Field label="Question type">
        <Controller
          name={`quest_type${question.id}`}
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <SelectOption
              field={{
                ...field,
                onChange: (e) => {
                  field.onChange(e[0]);
                  selectQuestionType(e[0], question);
                },
              }}
              list={questTypes}
              defaultMessage="Select question type"
            />
          )}
        />
      </Field>
    </FormControl>
  );
}