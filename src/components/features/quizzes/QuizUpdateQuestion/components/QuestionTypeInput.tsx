import { Question } from "@/app/typings/question";
import SelectOption from "@/components/core/SelectOption/SelectOption";
import { Field } from "@/components/ui/field";
import { FormControl } from "@chakra-ui/form-control";
import { ListCollection, Text } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";

interface IQuestionTypeInputProps {
  question: Question;
  questType: string;
  questTypes: ListCollection;
  selectQuestionType: (id: string, q: Question) => void;
}

export default function QuestionTypeInput({question, questType, questTypes, selectQuestionType}: IQuestionTypeInputProps) {
  const { control } = useFormContext();
  return (
    <>
      {questType ? (
        <FormControl>
          <Field label="Question type">
            <Controller
              name="id_quest_type"
              control={control}
              defaultValue={question.id_quest_type}
              rules={{ required: true }}
              render={({ field }) => (
                <SelectOption
                  field={{
                    ...field,
                    value: question.id_quest_type || "",
                    onChange: (e) => selectQuestionType(e[0], question),
                  }}
                  list={questTypes}
                  defaultMessage="Select question type"
                />
              )}
            />
          </Field>
        </FormControl>
      ) : (
        <Text>{questType}</Text>
      )}
    </>
  );
}