import { Question } from "@/app/typings/question";
import SelectOption from "@/components/core/SelectOption/SelectOption";
import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import { Button } from "@/styles/theme/components/button";
import { FormControl } from "@chakra-ui/form-control";
import { DeleteIcon } from "@chakra-ui/icons";
import { Input, ListCollection, Text } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";

interface IQuizUpdateQuestionProps {
  questionsArr: Question[];
  index: number;
  question: Question;
  questType: string;
  questTypes: ListCollection;
  handleDeleteQuestion: (id: string) => void;
  handleUpdateQuestion: (e: any, q: Question) => void;
  selectQuestionType: (id: string, q: Question) => void;
}

export default function QuizUpdateQuestion({
  questionsArr,
  index,
  question,
  questType,
  questTypes,
  handleDeleteQuestion,
  handleUpdateQuestion,
  selectQuestionType,
}: IQuizUpdateQuestionProps) {
  const { control, register } = useFormContext();
  return (
    <>
      {questType === undefined ? (
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
      <FormControl
        display="flex"
        alignItems="baseline"
        mb={3}
      >
        <InputGroup
          flex={1}
          startElement={
            <Text
              fontSize="sm"
              fontWeight="bold"
              pr={2}
            >
              {index + 1 + "."}
            </Text>
          }
          endElement={
            <Button
              visual="ghost"
              p={0}
              onClick={() => handleDeleteQuestion(question.id)}
              disabled={questionsArr.length === 1}
            >
              <DeleteIcon color="red" />
            </Button>
          }
        >
          <Input
            placeholder="Question"
            defaultValue={question.title}
            {...register(`q_title${question.id}`, { required: true })}
            onBlur={(e) => handleUpdateQuestion(e, question)}
          />
        </InputGroup>
      </FormControl>
    </>
  );
}