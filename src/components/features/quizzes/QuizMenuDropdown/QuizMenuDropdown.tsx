"use client";
import { Button } from "@/styles/theme/components/button";
import { deleteQuiz } from "@/utils/actions/quiz/deleteQuiz";
import { lazy, Suspense, useState } from "react";
import { QuizBasic } from "@/typings/quiz";
import { toaster } from "@/components/ui/toaster";
import { QuizType } from "@/typings/quiz";
import { Qa } from "@/typings/qa";
import { DialogContentWrapper } from "@/components/core/DialogContentWrapper/DialogContentWrapper";
import { Dialog, Text, Menu } from "@chakra-ui/react";
import { FaEllipsisV } from "react-icons/fa";
import LoadingSpinner from "@/components/core/LoadingSpinner/LoadingSpinner";

const QuizUpdateForm = lazy(() => import("../QuizUpdateForm/QuizUpdateForm"));

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
    <>
      <Menu.Root>
        <Menu.Trigger
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
          <FaEllipsisV />
        </Menu.Trigger>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item
              value="Edit"
              valueText="Edit"
              onClick={toggleEditDialog}
            >
              Edit
            </Menu.Item>
            <Menu.Item
              value="Delete"
              valueText="Delete"
              onClick={toggleDeleteDialog}
              color="fg.error"
              _hover={{ bg: "bg.error", color: "fg.error" }}
            >
              Delete
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
      <Dialog.Root
        lazyMount
        open={openDelete}
        onOpenChange={toggleDeleteDialog}
      >
        <DialogContentWrapper
          title="Delete Quiz"
          body={<Text>Are you sure you want to delete this quiz?</Text>}
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
      </Dialog.Root>

      <Dialog.Root
        lazyMount
        open={openEdit}
        onOpenChange={toggleEditDialog}
      >
        <DialogContentWrapper
          title="Update Quiz"
          body={
            <Suspense
              fallback={
                <LoadingSpinner
                  text="Setting quiz form..."
                  scale={0.85}
                />
              }
            >
              <QuizUpdateForm
                quiz={quiz}
                quizType={quizType}
                qaList={qaList}
                closeDialog={toggleEditDialog}
              />
            </Suspense>
          }
        />
      </Dialog.Root>
    </>
  );
}
