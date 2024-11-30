import { useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { QuizFormContext } from "../../../../shared/utils/contexts/QuizFormContext";
import { Answer } from "@/app/typings/answer";
import { Controller, useFormContext } from "react-hook-form";
import { QuestionType } from "@/app/typings/question_type";
import SelectOption from "@/components/core/SelectOption/SelectOption";
import {
  Box,
  createListCollection,
  Input,
} from "@chakra-ui/react";
import { Question } from "@/app/typings/question";
import { Button } from "@/styles/theme/components/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import QuestionList from "@/components/shared/QuestionList/QuestionList";

interface IQuizQuestionFormProps {
  questTypes: QuestionType[];
}

export default function QuizQuestionForm({
  questTypes,
}: IQuizQuestionFormProps) {
  const {
    quiz_id,
    questions,
    setQuestions,
  } = useContext(QuizFormContext);

  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: uuidv4(),
    title: "",
    quiz_id,
    id_quest_type: "",
    answers: [],
  });

  const { register, control, trigger } = useFormContext();

  const types = createListCollection({
    items: questTypes.map((type: QuestionType) => ({
      value: type.id,
      label: type.type_name,
    })),
  });

  const selectedTypeName = questTypes.find(
    (type) => type.id === currentQuestion.id_quest_type
  )?.type_name;

  console.log(questions)

  const addNewAnswer = () => {
    const currentAnswer = {
      id: uuidv4(),
      answer: "",
      correct_answer: false,
      question_id: currentQuestion.id,
    };
    setCurrentQuestion((prev) => {
      return {
        ...prev,
        answers: [...(prev.answers || []), currentAnswer],
      };
    });
  };

  const addNewQuestion = () => {
    setQuestions([
      ...questions,
      currentQuestion,
    ]);
    setCurrentQuestion({
      id: uuidv4(),
      title: "",
      quiz_id,
      id_quest_type: "",
      answers: [],
    });
  };

  const renderQuestionForm = () => {
    switch (selectedTypeName) {
      case "Single choice":
        if((currentQuestion.answers || []).length === 0) {
          setCurrentQuestion((prev) => {
            return {
              ...prev,
              answers: [
                {
                  id: uuidv4(),
                  answer: "",
                  correct_answer: false,
                  question_id: currentQuestion.id,
                },
                {
                  id: uuidv4(),
                  answer: "",
                  correct_answer: false,
                  question_id: currentQuestion.id,
                }
              ],
            };
          }
        )}
        return (
          <>
            <FormControl>
              <Input
                placeholder="Question title"
                value={currentQuestion.title}
                {...register("questionTitle", { required: true })}
                onChange={(e) => {
                  setCurrentQuestion(
                    (prev) => ({ ...prev, title: e.target.value })
                  );
                  trigger("questionTitle");
                }}
              />
            </FormControl>
            {Array.isArray(currentQuestion.answers) && currentQuestion.answers && (
              currentQuestion.answers.map((answer: Answer) => {
                return (
                  <FormControl
                    key={answer.id}
                  >
                    <Input
                      placeholder="Add answer option"
                      {...register(`q_${answer.question_id}_a_${answer.id}`, { required: true })}
                      onChange={(e) => {
                        trigger("answer");
                        setCurrentQuestion((prev) => {
                          return {
                            ...prev,
                            answers: (prev.answers ?? []).map((ans) => {
                              if (ans.id === answer.id) {
                                return {
                                  ...ans,
                                  answer: e.target.value,
                                };
                              }
                              return ans;
                            }
                        )}});
                      }}
                    />
                  </FormControl>
                );
              })
            )}
            <Button onClick={addNewAnswer}>Add answer</Button>
            <Button onClick={addNewQuestion}>Add question</Button>
          </>
        );

      default:
        return <div>Default</div>;
    }
  };

  return (
    <>
      <Box mb={currentQuestion.id_quest_type ? 2 : "{spacing.34}"}>
        <FormLabel>Choose question type</FormLabel>
        <Controller 
          control={control}
          name="questionType"
          render={({ field }) => (
            <SelectOption
              list={types}
              defaultMessage="Select question type"
              field={{
                ...field,
                value: field.value || [],
                onChange: (e) => {
                  field.onChange(e);
                  setCurrentQuestion(prev => 
                    ({...prev, id_quest_type: e[0]})
                  );
                }
              }}
            />
          )}
        />
        {currentQuestion.id_quest_type && renderQuestionForm()}
      </Box>
      <QuestionList questions={questions} />
    </>
  )
}
