import { Answer } from "@/app/typings/answer";
import { Question } from "@/app/typings/question";
import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import { Button } from "@/styles/theme/components/button";
import { Input } from "@chakra-ui/react";
import debounce from "debounce";
import { useFormContext } from "react-hook-form";
import { TbTrash, TbTrashOff } from "react-icons/tb";

interface IShortAnswerOptionInputProps {
  currentQuestion: Question;
  updateAnswer: (value: string, id: string) => void;
  deleteAnswer: (answerId: string) => void;
}

export default function ShortAnswerOptionInput({
  currentQuestion,
  updateAnswer,
  deleteAnswer,
}: IShortAnswerOptionInputProps) {
  const { register } = useFormContext();
  return (
    Array.isArray(currentQuestion.answers) &&
    currentQuestion.answers.map((answer: Answer) => {
      const disableDelete = Array.isArray(currentQuestion.answers) && currentQuestion.answers.length <= 1;
      return (
        <Field
          key={answer.id}
          helperText="Enter the correct answer and acceptable variations"
        >
          <InputGroup
            w="100%"
            endElement={
              <Button
                visual="ghost"
                onClick={() => deleteAnswer(answer.id)}
                disabled={disableDelete}
                p={0}
              >
                {
                  disableDelete ? <TbTrashOff size={20} /> : <TbTrash size={20} color="red" />
                }
              </Button>
            }
          >
            <Input
              placeholder="Answer"
              defaultValue={answer.answer}
              {...register(`answer${answer.id}`, {
                required: true,
              })}
              onChange={debounce((e) => {
                register(`answer${answer.id}`).onChange(e);
                updateAnswer(e.target.value, answer.id);
              }, 500)}
              autoComplete="off"
            />
          </InputGroup>
        </Field>
      );
    })
  );
}
