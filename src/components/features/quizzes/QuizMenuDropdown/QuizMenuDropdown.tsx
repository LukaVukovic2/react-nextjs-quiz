"use client";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useToast,
} from "@chakra-ui/react";
import QuizUpdateForm from "../QuizUpdateForm/QuizUpdateForm";
import { deleteQuiz } from "@/components/shared/utils/actions/quiz/deleteQuiz"; 
import { useRef } from "react";
import { Question } from "@/app/typings/question";
import { Answer } from "@/app/typings/answer";
import { Quiz } from "@/app/typings/quiz";

interface QuizMenuDropdownProps {
  quiz: Quiz;
  questions_and_answers: Array<{
    question: Question;
    answers: Answer[];
  }>;
}

export default function QuizMenuDropdown({ quiz, questions_and_answers }: QuizMenuDropdownProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();
  
  const cancelRef = useRef<HTMLButtonElement>(null);

  const handleQuizDelete = async (id: string) => {
    const success = await deleteQuiz(id);
    onCloseDelete();
    toast({
      title: success ? "Quiz deleted" : "Failed to delete quiz",
      status: success ? "success" : "error",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Menu>
      <MenuButton
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
      </MenuButton>
      <MenuList>
        <MenuItem onClick={onOpen}>Edit</MenuItem>
        <MenuItem onClick={onOpenDelete}>Delete</MenuItem>

        <AlertDialog
          leastDestructiveRef={cancelRef}
          motionPreset="slideInBottom"
          onClose={onCloseDelete}
          isOpen={isOpenDelete}
          isCentered
        >
          <AlertDialogOverlay />

          <AlertDialogContent>
            <AlertDialogHeader>Delete quiz</AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
              Are you sure you want to delete this quiz?
            </AlertDialogBody>
            <AlertDialogFooter>
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
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Modal
          isOpen={isOpen}
          onClose={onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Update Quiz</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <QuizUpdateForm
                quiz={quiz}
                questions_and_answers={questions_and_answers}
                onClose={onClose}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      </MenuList>
    </Menu>
  );
}
