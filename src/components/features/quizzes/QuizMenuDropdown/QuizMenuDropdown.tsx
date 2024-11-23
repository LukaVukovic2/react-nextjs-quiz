"use client";
import { Button } from "@/styles/theme/components/button";
import { MenuRoot, MenuItem, MenuContent, MenuTrigger } from "@/components/ui/menu";
import QuizUpdateForm from "../QuizUpdateForm/QuizUpdateForm";
import { deleteQuiz } from "@/components/shared/utils/actions/quiz/deleteQuiz"; 
import { useState } from "react";
import { Question } from "@/app/typings/question";
import { Answer } from "@/app/typings/answer";
import { Quiz } from "@/app/typings/quiz";
import { DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle } from "@/components/ui/dialog";
import { toaster } from "@/components/ui/toaster";
import "./QuizMenuDropdown.css";

interface QuizMenuDropdownProps {
  quiz: Quiz;
  questions_and_answers: Array<{
    question: Question;
    answers: Answer[];
  }>;
}

export default function QuizMenuDropdown({ quiz, questions_and_answers }: QuizMenuDropdownProps) {
  const [ openEdit, setOpenEdit ] = useState(false);
  const [ openDelete, setOpenDelete ] = useState(false);

  const handleQuizDelete = async (id: string) => {
    const success = await deleteQuiz(id);
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
        cursor="pointer"
      >
        <i className="fa-solid fa-ellipsis-vertical"></i>
      </MenuTrigger>
      <MenuContent>
        <MenuItem className="menu-item" value="Edit" valueText="Edit" onClick={() => setOpenEdit(true)}>Edit</MenuItem>
        <MenuItem className="menu-item" value="Delete" valueText="Delete" onClick={() => setOpenDelete(true)}>Delete</MenuItem>

        <DialogRoot
          motionPreset="slide-in-bottom"
          open={openDelete}
          onOpenChange={(e) => setOpenDelete(e.open)}
        >
          <DialogContent>
            <DialogCloseTrigger />
            <DialogHeader>
              <DialogTitle>Delete Quiz</DialogTitle>
            </DialogHeader>
            <DialogBody>
              Are you sure you want to delete this quiz?
            </DialogBody>
            <DialogFooter>
              <Button
                onClick={() => setOpenDelete(false)}
                visual="outline"
                autoFocus
              >
                No
              </Button>
              <Button
                visual="danger"
                ml={3}
                onClick={() => handleQuizDelete(quiz.id)}
              >
                Yes
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogRoot>

        <DialogRoot
          open={openEdit}
          onOpenChange={(e) => setOpenEdit(e.open)}
        >
          <DialogContent>
            <DialogCloseTrigger />
            <DialogHeader>
              <DialogTitle>Update Quiz</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <QuizUpdateForm
                quiz={quiz}
                questions_and_answers={questions_and_answers}
                onClose={() => setOpenEdit(false)}
              />
            </DialogBody>
          </DialogContent>
        </DialogRoot>
      </MenuContent>
    </MenuRoot>
  );
}
