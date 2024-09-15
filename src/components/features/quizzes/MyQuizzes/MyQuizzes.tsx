"use client";
import { Quiz } from "@/app/typings/quiz";
import { deleteQuiz } from "@/components/shared/utils/quiz/deleteQuiz";
import { Flex, List, ListItem, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";

export default function MyQuizzes({ quizzes }: { quizzes: Quiz[] }) {
  const openModal = async (id: string) => {
    console.log(id);
    
  }

  const handleQuizDelete = async (id: string) => {
    const success = await deleteQuiz(id);
    console.log(success);
  }

  return (
    <Flex
      flexDir="column"
      alignItems="center"
    >
      <List
        style={{
          width: "500px",
        }}
      >
        {quizzes.map((quiz: Quiz) => (
          <ListItem
            key={quiz.id}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt="-1px"
            style={{
              border: "1px solid lightgrey",
              padding: "10px"
            }}
          >
            <div>
              <h2>{quiz.title}</h2>
              <p>{quiz.category}</p>
              <p>{quiz.timer}</p>
            </div>
            <Menu>
              <MenuButton
                px={4}
                py={2}
                transition='all 0.2s'
                borderRadius='md'
                borderWidth='1px'
                _hover={{ bg: 'gray.400' }}
                _expanded={{ bg: 'blue.400' }}
                _focus={{ boxShadow: 'outline' }}
              >
                <i className="fa-solid fa-ellipsis-vertical"></i>
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => openModal(quiz.id)}>Edit</MenuItem>
                <MenuItem onClick={() => handleQuizDelete(quiz.id)}>Delete</MenuItem>
              </MenuList>
            </Menu>
          </ListItem>
        ))}
      </List>
    </Flex>
  );
}
