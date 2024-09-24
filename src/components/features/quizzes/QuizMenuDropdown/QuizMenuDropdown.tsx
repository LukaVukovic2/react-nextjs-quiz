'use client';
import { Quiz } from "@/app/typings/quiz";
import { deleteQuiz } from "@/components/shared/utils/quiz/deleteQuiz";
import { Menu, MenuButton, MenuList, MenuItem, useDisclosure, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import QuizUpdateForm from "../QuizUpdateForm/QuizUpdateForm";
import { Question } from "@/app/typings/question";
import { Answer } from "@/app/typings/answer";

interface QuizMenuDropdownProps {
  quiz: Quiz;
  questions_and_answers: Array<{
    question: Question;
    answers: Answer[];
  }>;
}

export default function QuizMenuDropdown({quiz, questions_and_answers} : QuizMenuDropdownProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleQuizDelete = async (id: string) => {
    const success = await deleteQuiz(id);
    console.log(success);
  }

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
        <MenuItem onClick={() => handleQuizDelete(quiz.id)}>Delete</MenuItem>

        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Quiz</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <QuizUpdateForm quiz={quiz} questions_and_answers={questions_and_answers} onClose={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
      </MenuList>
    </Menu>
  );
}
