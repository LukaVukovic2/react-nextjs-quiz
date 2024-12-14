import { Answer } from "@/app/typings/answer";
import { Question } from "@/app/typings/question";
import { InputGroup } from "@/components/ui/input-group";
import { Button } from "@/styles/theme/components/button";
import { FormControl } from "@chakra-ui/form-control";
import { CheckCircleIcon, DeleteIcon } from "@chakra-ui/icons";
import { Input } from "@chakra-ui/react";
import debounce from "debounce";
import { useFormContext } from "react-hook-form";

interface IChoiceQuestionInputProps {
  currentQuestion: Question;
  updateAnswer: (e: React.FocusEvent<HTMLInputElement>, id: string) => void;
  changeCorrectAnswer: (id: string, typeName: string) => void;
  selectedTypeName: string;
  deleteAnswer: (answerId: string) => void;
}

export default function ChoiceQuestionInput({
  currentQuestion,
  updateAnswer,
  changeCorrectAnswer,
  selectedTypeName,
  deleteAnswer
}: IChoiceQuestionInputProps) {

  const { register } = useFormContext();
  return (
    Array.isArray(currentQuestion.answers) &&
      currentQuestion.answers &&
      currentQuestion.answers.map((answer: Answer) => {
        return (
          <FormControl key={answer.id}>
            <InputGroup
              w="100%"
              startElement={
                answer.correct_answer && selectedTypeName === "Single choice" ? (
                  <CheckCircleIcon
                    color="green"
                    fontSize="17px"
                  />
                ) : (
                  <input
                    type={selectedTypeName === "Single choice" ? "radio" : "checkbox"}
                    checked={answer.correct_answer}
                    name={`correctAnswer_${currentQuestion.id}`}
                    onChange={() =>
                      changeCorrectAnswer(answer.id, selectedTypeName)
                    }
                    style={{ cursor: "pointer" }}
                  />
                )
              }
              endElement={
                Array.isArray(currentQuestion.answers) &&
                currentQuestion.answers.length > 2 && (
                  <Button
                    disabled={answer.correct_answer}
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
                onChange={debounce((e) => updateAnswer(e, answer.id), 500)}
                autoComplete="off"
              />
            </InputGroup>
          </FormControl>
        );
      })
  );
}