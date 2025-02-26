import { Qa } from "@/app/typings/qa";
import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import { Button } from "@/styles/theme/components/button";
import { Input } from "@chakra-ui/react";
import debounce from "debounce";
import { useFormContext } from "react-hook-form";
import { TbTrash, TbTrashOff } from "react-icons/tb";

interface IShortAnswerOptionInputProps {
  currentQa: Qa;
  updateAnswer: (value: string, id: string) => void;
  deleteAnswer: (answerId: string) => void;
}

export default function ShortAnswerOptionInput({
  currentQa,
  updateAnswer,
  deleteAnswer,
}: IShortAnswerOptionInputProps) {
  const { register } = useFormContext();
  const { answers } = currentQa;
  return (
    answers.map((ans) => {
      const disableDelete = answers.length <= 1;
      return (
        <Field
          key={ans.id}
          helperText="Enter the correct answer and acceptable variations"
        >
          <InputGroup
            w="100%"
            endElement={
              <Button
                visual="ghost"
                onClick={() => deleteAnswer(ans.id)}
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
              defaultValue={ans.answer}
              {...register(`answer${ans.id}`, {
                required: true,
              })}
              onChange={debounce((e) => {
                register(`answer${ans.id}`).onChange(e);
                updateAnswer(e.target.value, ans.id);
              }, 500)}
              autoComplete="off"
            />
          </InputGroup>
        </Field>
      );
    })
  );
}