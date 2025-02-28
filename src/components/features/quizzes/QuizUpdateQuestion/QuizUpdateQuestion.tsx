import { Answer } from "@/app/typings/answer";
import { Question } from "@/app/typings/question";
import { MyQuizzesContext } from "@/components/shared/utils/contexts/MyQuizzesContext";
import { QuizUpdateContext } from "@/components/shared/utils/contexts/QuizUpdateContext";
import { InputGroup } from "@/components/ui/input-group";
import { Button } from "@/styles/theme/components/button";
import { FormControl } from "@chakra-ui/form-control";
import { Input, Text } from "@chakra-ui/react";
import debounce from "debounce";
import { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { TbTrashOff, TbTrash } from "react-icons/tb";
import QuestionTypeController from "./components/QuestionTypeController";

interface IQuizUpdateQuestionProps {
  index: number;
  question: Question;
  questType: string;
}

export default function QuizUpdateQuestion({
  index,
  question,
  questType,
}: IQuizUpdateQuestionProps) {
  const { register, trigger } = useFormContext();

  const { questTypes } = useContext(MyQuizzesContext);

  const {
    questionsArr,
    setQuestionsArr,
    setDirtyQuestions,
    setDeletedQuestions,
    setAnswersArr,
    setDirtyAnswers,
  } = useContext(QuizUpdateContext);

  const updateQuestionArr = (
    questions: Question[],
    updatedItem: Question
  ) => {
    const index = questions.findIndex((item) => item.id === updatedItem.id);
    return index === -1 ? [...questions, updatedItem] : questions.map((q) => (q.id === updatedItem.id ? updatedItem : q));
  };

  const changeQuestionTitle = (title: string, q: Question) => {
    const newQuestion: Question = { ...q, title };
    setDirtyQuestions((prev) => updateQuestionArr(prev, newQuestion));
  };

  const selectQuestionType = (value: string, question: Question) => {
    const questType = questTypes.items.find((qt) => qt.value === value)?.label;
    const newQuestion: Question = { ...question, id_quest_type: value };
  
    setDirtyQuestions((prev) => updateQuestionArr(prev, newQuestion));
    setQuestionsArr((prev) => updateQuestionArr(prev, newQuestion));
  
    const defaultCorrectAns: Answer = {
      id: uuidv4(),
      answer: "",
      question_id: question.id,
      correct_answer: true,
    };
    if (questType === "Short answer") {
      setAnswersArr((prev) => [...prev, defaultCorrectAns]);
      setDirtyAnswers((prev) => [...prev, defaultCorrectAns]);
    } else {
      const answerId = uuidv4();
      const defaultFalseAns: Answer = {
        ...defaultCorrectAns,
        id: answerId,
        correct_answer: false,
      };
      setAnswersArr((prev) => [...prev, defaultCorrectAns, defaultFalseAns]);
      setDirtyAnswers((prev) => [...prev, defaultCorrectAns, defaultFalseAns]);
    }
  };

  const deleteQuestion = (deletedId: string) => {
    setQuestionsArr((prev) => prev.filter(({id}) => id !== deletedId));
    setDirtyQuestions((prev) => prev.filter(({id}) => id !== deletedId));
    setDeletedQuestions((prev) => [...prev, deletedId]);
    setAnswersArr((prev) => prev.filter(({question_id}) => question_id !== deletedId));
    setDirtyAnswers((prev) =>
      prev.filter(({question_id}) => question_id !== deletedId)
    );
    trigger();
  };
  const isDisabled = questionsArr.length === 1;

  return (
    <>
      {questType === undefined ? (
        <QuestionTypeController
          question={question}
          selectQuestionType={selectQuestionType}
        />
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
              onClick={() => deleteQuestion(question.id)}
              disabled={isDisabled}
            >
              {isDisabled ? <TbTrashOff size={20} /> : <TbTrash color="red" size={20} />}
            </Button>
          }
        >
          <Input
            placeholder="Question"
            defaultValue={question.title}
            {...register(`q_title${question.id}`, {
              required: true,
              onChange: debounce(
                (e) => changeQuestionTitle(e.target.value, question),
                500
              )
            })}
          />
        </InputGroup>
      </FormControl>
    </>
  );
}