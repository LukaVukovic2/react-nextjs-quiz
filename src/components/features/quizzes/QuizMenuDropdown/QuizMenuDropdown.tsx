"use client";
import { Button } from "@/styles/theme/components/button";
import {
  MenuRoot,
  MenuItem,
  MenuContent,
  MenuTrigger,
} from "@/components/ui/menu";
import QuizUpdateForm from "../QuizUpdateForm/QuizUpdateForm";
import { deleteQuiz } from "@/components/shared/utils/actions/quiz/deleteQuiz";
import { useState } from "react";
import { QuizBasic } from "@/app/typings/quiz";
import {
  DialogRoot,
} from "@/components/ui/dialog";
import { toaster } from "@/components/ui/toaster";
import { QuizType } from "@/app/typings/quiz_type";
import "./QuizMenuDropdown.css";
import { Qa } from "@/app/typings/qa";
import { DialogContentWrapper } from "@/components/core/DialogContentWrapper/DialogContentWrapper";
import { Text } from "@chakra-ui/react";

interface QuizMenuDropdownProps {
  quiz: QuizBasic;
  quizType: QuizType;
  qaList: Qa[];
}

export default function QuizMenuDropdown({
  quiz,
  quizType,
  qaList,
}: QuizMenuDropdownProps) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const toggleEditDialog = () => setOpenEdit(!openEdit);
  const toggleDeleteDialog = () => setOpenDelete(!openDelete);

  const handleQuizDelete = async (id: string) => {
    const success = await deleteQuiz(id);
    toaster.create({
      title: success ? "Quiz deleted" : "Failed to delete quiz",
      type: success ? "success" : "error",
      duration: 3000,
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
        <MenuItem
          className="menu-item"
          value="Edit"
          valueText="Edit"
          onClick={toggleEditDialog}
        >
          Edit
        </MenuItem>
        <MenuItem
          className="menu-item"
          value="Delete"
          valueText="Delete"
          onClick={toggleDeleteDialog}
        >
          Delete
        </MenuItem>

        <DialogRoot
          motionPreset="slide-in-bottom"
          open={openDelete}
          onOpenChange={toggleDeleteDialog}
        >   
          <DialogContentWrapper 
            title="Delete Quiz" 
            body={
              <Text>Are you sure you want to delete this quiz?</Text>
            }
            footer={
              <>
                <Button
                  onClick={toggleDeleteDialog}
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
              </>
            }
          />
        </DialogRoot>

        <DialogRoot
          open={openEdit}
          onOpenChange={toggleEditDialog}
        >
          <DialogContentWrapper 
            title="Update Quiz" 
            body={
              <QuizUpdateForm
                quiz={quiz}
                quizType={quizType}
                qaList={qaList}
                onClose={toggleEditDialog}
              />
            }
          />
        </DialogRoot>
      </MenuContent>
    </MenuRoot>
  );
}