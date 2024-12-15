import { InputGroup } from "@/components/ui/input-group";
import { Button } from "@/styles/theme/components/button";
import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import debounce from "debounce";
import { Answer } from "@/app/typings/answer";
import { Question } from "@/app/typings/question";
import { FaCheckCircle } from "react-icons/fa";
import { TbTrash, TbTrashOff } from "react-icons/tb";

interface IChoiceQuestionInputProps {
  currentQuestion: Question;
  updateAnswer: (value: string, id: string) => void;
  changeCorrectAnswer: (id: string, typeName: string) => void;
  selectedTypeName: string;
  deleteAnswer: (answerId: string) => void;
}

export default function ChoiceQuestionInput({
  currentQuestion,
  updateAnswer,
  changeCorrectAnswer,
  selectedTypeName,
  deleteAnswer,
}: IChoiceQuestionInputProps) {
  const { register } = useFormContext();
  return (
    Array.isArray(currentQuestion.answers) &&
    currentQuestion.answers.map((answer: Answer) => {
      const disableDelete =
        (Array.isArray(currentQuestion.answers) &&
          currentQuestion.answers.length <= 2) ||
        answer.correct_answer;
      return (
        <FormControl key={answer.id}>
          <InputGroup
            w="100%"
            startElement={
              answer.correct_answer && selectedTypeName === "Single choice" ? (
                <FaCheckCircle color="green" size={15} />
              ) : (
                <input
                  type={
                    selectedTypeName === "Single choice" ? "radio" : "checkbox"
                  }
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
              <Button
                disabled={disableDelete}
                visual="ghost"
                onClick={() => deleteAnswer(answer.id)}
                p={0}
              >
                { disableDelete ? <TbTrashOff size={20} /> : <TbTrash size={20} color="red" /> }
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
        </FormControl>
      );
    })
  );
}