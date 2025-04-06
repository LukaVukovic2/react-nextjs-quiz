import { InputGroup } from "@/components/ui/input-group";
import { Button } from "@/styles/theme/components/button";
import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import debounce from "debounce";
import { Answer } from "@/typings/answer";
import { FaCheckCircle } from "react-icons/fa";
import { TbTrash, TbTrashOff } from "react-icons/tb";
import { Qa } from "@/typings/qa";

interface IChoiceQuestionInputProps {
  currentQa: Qa;
  updateAnswer: (value: string, id: string) => void;
  changeCorrectAnswer: (id: string, typeName: string) => void;
  selectedTypeName: string;
  deleteAnswer: (answerId: string) => void;
}

export default function ChoiceQuestionInput({
  currentQa,
  updateAnswer,
  changeCorrectAnswer,
  selectedTypeName,
  deleteAnswer,
}: IChoiceQuestionInputProps) {
  const { answers } = currentQa;
  const { register } = useFormContext();
  return answers.map((ans: Answer) => {
    const disableDelete = answers.length <= 2 || ans.correct_answer;
    return (
      <FormControl key={ans.id}>
        <InputGroup
          w="100%"
          startElement={
            ans.correct_answer && selectedTypeName === "Single choice" ? (
              <FaCheckCircle
                color="green"
                size={15}
              />
            ) : (
              <input
                type={
                  selectedTypeName === "Single choice" ? "radio" : "checkbox"
                }
                checked={ans.correct_answer}
                name={`correctAnswer_${currentQa.question.id}`}
                onChange={() => changeCorrectAnswer(ans.id, selectedTypeName)}
                style={{ cursor: "pointer" }}
              />
            )
          }
          endElement={
            <Button
              disabled={disableDelete}
              visual="ghost"
              onClick={() => deleteAnswer(ans.id)}
              p={0}
            >
              {disableDelete ? (
                <TbTrashOff size={20} />
              ) : (
                <TbTrash
                  size={20}
                  color="red"
                />
              )}
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
      </FormControl>
    );
  });
}