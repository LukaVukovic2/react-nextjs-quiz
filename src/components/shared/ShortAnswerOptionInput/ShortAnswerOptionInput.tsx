import { Answer } from "@/app/typings/answer";
import { Question } from "@/app/typings/question";
import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import { Button } from "@/styles/theme/components/button";
import { DeleteIcon } from "@chakra-ui/icons";
import { Input } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

interface IShortAnswerOptionInputProps {
  currentQuestion: Question;
  updateAnswer: (e: React.FocusEvent<HTMLInputElement>, id: string) => void;
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
    currentQuestion.answers &&
    currentQuestion.answers.map((answer: Answer) => {
      return (
        <Field
          key={answer.id}
          helperText="Enter the correct answer and acceptable variations"
        >
          <InputGroup
            w="100%"
            endElement={
              Array.isArray(currentQuestion.answers) &&
              currentQuestion.answers.length > 1 && (
                <Button
                  visual="danger"
                  onClick={() => deleteAnswer(answer.id)}
                >
                  <DeleteIcon />
                </Button>
              )
            }
          >
            <Input
              placeholder="Answer"
              defaultValue={answer.answer}
              {...register(`answer${answer.id}`, {
                required: true,
              })}
              onBlur={(e) => updateAnswer(e, answer.id)}
              autoComplete="off"
            />
          </InputGroup>
        </Field>
      );
    })
  );
}