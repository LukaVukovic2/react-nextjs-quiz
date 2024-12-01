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
import { InputGroup } from "@/components/ui/input-group";
import { CheckCircleIcon, DeleteIcon } from "@chakra-ui/icons";
import "../QuizForm.css";

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

  const { register, control, trigger, formState: {isValid} } = useFormContext();

  const types = createListCollection({
    items: questTypes.map((type: QuestionType) => ({
      value: type.id,
      label: type.type_name,
    })),
  });

  const selectedTypeName = questTypes.find(
    (type) => type.id === currentQuestion.id_quest_type
  )?.type_name;

  const initializeCurrentAnswers = (typeId: string) => {
    const typeName = questTypes.find(
      (type) => type.id === typeId
    )?.type_name;
    setCurrentQuestion((prev) => {
      if(typeName === "Single choice" || typeName === "Multiple choice") {
        return {
          ...prev,
          answers: [
            {
              id: uuidv4(),
              answer: "",
              correct_answer: true,
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
      else if(typeName === "Short answer") {
        return {
          ...prev,
          answers: [
            {
              id: uuidv4(),
              answer: "",
              correct_answer: true,
              question_id: currentQuestion.id,
            }
          ],
        };
      }
      return { ...prev };
    });
  }

  const addNewAnswer = (type_name?: string) => {
    const currentAnswer = {
      id: uuidv4(),
      answer: "",
      correct_answer: type_name === "Short answer" ? true : false,
      question_id: currentQuestion.id,
    };
    setCurrentQuestion((prev) => {
      return {
        ...prev,
        answers: [...(prev.answers || []), currentAnswer],
      };
    });
    trigger(`correctAnswer_${currentQuestion.id}`);
    trigger(`answer${currentAnswer.id}`);
  };

  const addNewQuestion = () => {
    setQuestions([
      ...questions,
      currentQuestion,
    ]);
    setCurrentQuestion({
      ...currentQuestion,
      id: uuidv4(),
      title: "",
      answers: [],
    });
    trigger();
    initializeCurrentAnswers(currentQuestion.id_quest_type);
  };

  const changeCorrectAnswer = (answerId: string, selectedTypeName: string) => {
    setCurrentQuestion((prev) => ({
      ...prev,
      answers: (prev.answers || []).map((ans) => ({
        ...ans,
        correct_answer: selectedTypeName === "Single choice"
          ? ans.id === answerId
          : ans.id === answerId
          ? !ans.correct_answer
          : ans.correct_answer,
      })),
    }));
    trigger(`correctAnswer_${currentQuestion.id}`);
  }

  const changeQuestionTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentQuestion((prev) => ({
      ...prev,
      title: e.target.value,
    }));
    trigger("questionTitle");
  }

  const updateAnswer = (e: React.FocusEvent<HTMLInputElement>, answerId: string) => {
    setCurrentQuestion((prev) => {
      return {
        ...prev,
        answers: (prev.answers ?? []).map((ans) => {
          if (ans.id === answerId) {
            return {
              ...ans,
              answer: e.target.value,
            };
          }
          return ans;
        })
      }
    }
  )};

  const deleteAnswer = (answerId: string) => {
    setCurrentQuestion((prev) => {
      return {
        ...prev,
        answers: (prev.answers ?? []).filter((ans) => ans.id !== answerId),
      };
    });
  };

  const renderQuestionTypeForm = () => {
    switch (selectedTypeName) {
      case "Single choice":
      case "Multiple choice":
        return (
          <>
            <FormControl>
              <Input
                placeholder="Question title"
                value={currentQuestion.title}
                {...register("questionTitle", { required: true })}
                onChange={(e) => changeQuestionTitle(e)}
              />
            </FormControl>
            {Array.isArray(currentQuestion.answers) && currentQuestion.answers && (
              currentQuestion.answers.map((answer: Answer) => {
                return (
                  <FormControl
                    key={answer.id}
                  >
                    <InputGroup
                      w="100%"
                      startElement={
                        selectedTypeName === "Single choice" ? (answer.correct_answer ? (
                          <CheckCircleIcon color="green" fontSize="17px" />
                        ) : (
                          <input
                            type="radio"
                            checked={answer.correct_answer}
                            name={`correctAnswer_${currentQuestion.id}`}
                            onChange={() => changeCorrectAnswer(answer.id, selectedTypeName)}
                            style={{ cursor: "pointer" }}
                          />
                        )) : (
                          <input
                            type="checkbox"
                            checked={answer.correct_answer}
                            name={`correctAnswer_${currentQuestion.id}`}
                            onChange={() => changeCorrectAnswer(answer.id, selectedTypeName)}
                            style={{ cursor: "pointer" }}
                          />
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
                      />
                    </InputGroup>
                  </FormControl>
                );
              })
            )}
            <Button visual="ghost" onClick={() => addNewAnswer()}>Add answer</Button>
            <Button disabled={!isValid} onClick={addNewQuestion}>Add question</Button>
          </>
        );
      case "Short answer": 
        return (
          <>
            <FormControl>
              <Input
                placeholder="Question title"
                value={currentQuestion.title}
                {...register("questionTitle", { required: true })}
                onChange={(e) => changeQuestionTitle(e)}
              />
            </FormControl>
            {Array.isArray(currentQuestion.answers) && currentQuestion.answers && (
              currentQuestion.answers.map((answer: Answer) => {
                return (
                  <FormControl
                    key={answer.id}
                  >
                    <InputGroup 
                      w="100%"
                      endElement={
                        Array.isArray(currentQuestion.answers) && currentQuestion.answers.length > 1 && (
                          <Button visual="danger" onClick={() => deleteAnswer(answer.id)}>
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
                      />

                    </InputGroup>
                  </FormControl>
                );
              }))
            }
            <Button visual="ghost" onClick={() => addNewAnswer(selectedTypeName)}>Add answer</Button>
            <Button disabled={!isValid} onClick={addNewQuestion}>Add question</Button>
          </>
        )
      ;
      
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
                  initializeCurrentAnswers(e[0]);
                }
              }}
            />
          )}
        />
        {currentQuestion.id_quest_type && renderQuestionTypeForm()}
      </Box>
      <QuestionList questions={questions} />
    </>
  )
}
