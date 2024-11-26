import { useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { QuizFormContext } from "../utils/QuizFormContext";
import QuestionList from "@/components/shared/QuestionList/QuestionList";
import { FormControl } from "@chakra-ui/form-control";
import { AddIcon } from "@chakra-ui/icons";
import {
  Flex,
  chakra,
  Card,
  Stack,
  StackSeparator,
  Box,
  Input,
  Text,
} from "@chakra-ui/react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/styles/theme/components/button";
import { Answer } from "@/app/typings/answer";
import { useFormContext } from "react-hook-form";
import AnswerGroupBox from "@/components/shared/AnswerGroupBox/AnswerGroupBox";
import { getLetterByIndex } from "@/components/shared/utils/getLetterByIndex";

export default function QuizQuestionForm() {
  const {
    quiz_id,
    questions,
    setQuestions,
    questionTitle,
    setQuestionTitle,
    question_id,
    setQuestionId,
    answers,
    setAnswers,
    isCorrect,
    setIsCorrect,
    currentQuestion,
    setCurrentQuestion,
  } = useContext(QuizFormContext);

  const { register, trigger, resetField, getValues } = useFormContext();

  const validateQuestion = (answer: Answer) => {
    if (answer.correct_answer) {
      setCurrentQuestion({ ...currentQuestion, correct: true });
    } else {
      setCurrentQuestion({ ...currentQuestion, incorrect: true });
    }
  };

  const isQuestionValid =
    !currentQuestion.correct ||
    !currentQuestion.incorrect ||
    questionTitle === "";

  const addAnswer = () => {
    const answer = {
      id: uuidv4(),
      answer: getValues().answer,
      correct_answer: getValues().correctAnswer,
      question_id,
    };
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    validateQuestion(answer);
    resetField("answer");
    resetField("correctAnswer", { defaultValue: false });
    setIsCorrect(false);
  };

  const addQuestion = () => {
    const id = question_id;
    setQuestions([
      ...questions,
      {
        id,
        title: getValues().questionTitle,
        quiz_id,
        answers,
      },
    ]);
    setAnswers([]);
    setQuestionTitle("");
    resetField("questionTitle");
    resetField("answer");
    resetField("correctAnswer", { defaultValue: false });
    setIsCorrect(false);
    setQuestionId(uuidv4());
    setCurrentQuestion({ correct: false, incorrect: false });
  };
  return (
    <>
      <Flex gap={10}>
        <chakra.div flex={1}>
          <Card.Root>
            <Card.Body>
              <Stack
                separator={<StackSeparator />}
                spaceY={4}
              >
                <Box>
                  <FormControl>
                    <Input
                      placeholder="Question title"
                      {...register("questionTitle", { required: true })}
                      onChange={(e) => {
                        setQuestionTitle(e.target.value);
                        trigger("questionTitle");
                      }}
                    />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl>
                    <Input
                      placeholder="Add answer option"
                      {...register("answer", { required: true })}
                      onBlur={() => trigger("answer")}
                    />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl>
                    <Checkbox
                      disabled={currentQuestion.correct}
                      {...register("correctAnswer")}
                      checked={isCorrect}
                      cursor="pointer"
                      onCheckedChange={(e) => setIsCorrect(!!e.checked)}
                    >
                      Correct Answer
                    </Checkbox>
                  </FormControl>
                </Box>
              </Stack>
              <div>
                <Button
                  disabled={!getValues("answer")}
                  onClick={addAnswer}
                  visual="outline"
                >
                  New Answer
                </Button>
              </div>
            </Card.Body>
          </Card.Root>
        </chakra.div>
        <Flex flexDirection="column" alignItems="start" gap={2} flex={1} >
          <Text fontWeight="semibold" fontSize="xl">Current Question</Text>
          <Text textTransform="uppercase">Title:</Text>
          {questionTitle ? 
            <Text>{questionTitle}</Text> : 
            <Text color="dark.800">No title</Text>}
          <Text textTransform="uppercase">Answers:</Text>
          <div>
            {answers.length > 0 ? 
              answers.map((answer, index) => {
                const letter = getLetterByIndex(index);
                return <AnswerGroupBox key={answer.id} answer={answer} letter={letter} />
              }) : <Text color="dark.800">No answers</Text>
            }
          </div>
          <Button
            disabled={isQuestionValid}
            onClick={addQuestion}
          >
            <AddIcon />
            Add Question
          </Button>
        </Flex>
      </Flex>
      <Text>Your Questions:</Text>
      <QuestionList questions={questions} />
    </>
  );
}