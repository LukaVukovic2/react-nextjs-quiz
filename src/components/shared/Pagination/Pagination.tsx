"use client";
import { Flex } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import NextLink from "next/link";

export default function Pagination({ id, currentPage, totalPages }: { id: string, currentPage: number, totalPages: number }) {
  return (
    <Flex
      justifyContent="space-between"
      mt={2}
    >
      <NextLink href={`/quizzes/${id}?page=${currentPage - 1}`}>
        <Button visibility={currentPage > 1 ? "visible" : "hidden"}>
          Previous
        </Button>
      </NextLink>
      <NextLink href={`/quizzes/${id}?page=${currentPage + 1}`}>
        <Button visibility={currentPage < totalPages ? "visible" : "hidden"}>
          Next
        </Button>
      </NextLink>
    </Flex>
  )
}