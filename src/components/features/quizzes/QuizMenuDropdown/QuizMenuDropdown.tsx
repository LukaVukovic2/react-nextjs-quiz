"use client";
import {
  useDisclosure
} from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { MenuRoot, MenuItem, MenuContent, MenuTrigger } from "@/components/ui/menu";
import QuizUpdateForm from "../QuizUpdateForm/QuizUpdateForm";
import { deleteQuiz } from "@/components/shared/utils/actions/quiz/deleteQuiz"; 
import { useRef } from "react";
import { Question } from "@/app/typings/question";
import { Answer } from "@/app/typings/answer";
import { Quiz } from "@/app/typings/quiz";
import { DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogRoot } from "@/components/ui/dialog";
import { Toaster, toaster } from "@/components/ui/toaster";

interface QuizMenuDropdownProps {
  quiz: Quiz;
  questions_and_answers: Array<{
    question: Question;
    answers: Answer[];
  }>;
}

export default function QuizMenuDropdown({ quiz, questions_and_answers }: QuizMenuDropdownProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();
  
  const cancelRef = useRef<HTMLButtonElement>(null);

  const handleQuizDelete = async (id: string) => {
    const success = await deleteQuiz(id);
    onCloseDelete();
    toaster.create({
      title: success ? "Quiz deleted" : "Failed to delete quiz",
      type: success ? "success" : "error",
      duration: 3000
    });
  };

  return (
    <MenuRoot>
      <MenuTrigger
        px={4}
        py={2}
        transition="all 0.2s"
        borderRadius="md"
        borderWidth="1px"
        _hover={{ bg: "gray.400" }}
        _expanded={{ bg: "blue.400" }}
        _focus={{ boxShadow: "outline" }}
      >
        <i className="fa-solid fa-ellipsis-vertical"></i>
      </MenuTrigger>
      <MenuContent>
        <MenuItem value="Edit" valueText="Edit" onClick={onOpen}>Edit</MenuItem>
        <MenuItem value="Delete" valueText="Delete" onClick={onOpenDelete}>Delete</MenuItem>

        <DialogRoot
          leastDestructiveRef={cancelRef}
          motionPreset="slideInBottom"
          onClose={onCloseDelete}
          isOpen={isOpenDelete}
          isCentered
        >

          <DialogContent>
            <DialogHeader>Delete quiz</DialogHeader>
            <DialogCloseTrigger />
            <DialogBody>
              Are you sure you want to delete this quiz?
            </DialogBody>
            <DialogFooter>
              <Button
                ref={cancelRef}
                onClick={onCloseDelete}
              >
                No
              </Button>
              <Button
                colorScheme="red"
                ml={3}
                onClick={() => handleQuizDelete(quiz.id)}
              >
                Yes
              </Button>
              <Toaster />
            </DialogFooter>
          </DialogContent>
        </DialogRoot>

        <DialogRoot
          isOpen={isOpen}
          onClose={onClose}
        >
          <DialogContent>
            <DialogHeader>Update Quiz</DialogHeader>
            <DialogCloseTrigger />
            <DialogBody>
              <QuizUpdateForm
                quiz={quiz}
                questions_and_answers={questions_and_answers}
                onClose={onClose}
              />
            </DialogBody>
          </DialogContent>
        </DialogRoot>
      </MenuContent>
    </MenuRoot>
  );
}
