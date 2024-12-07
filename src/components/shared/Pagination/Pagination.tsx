"use client";
import { Flex, chakra } from "@chakra-ui/react";
import NextLink from "next/link";

export default function Pagination({ id, currentPage, totalPages }: { id: string, currentPage: number, totalPages: number }) {
  return (
    <Flex
      justifyContent="space-between"
      mt={2}
    >
      <NextLink href={`/quizzes/${id}?page=${currentPage - 1}`}>
        <chakra.div visibility={currentPage > 1 ? "visible" : "hidden"}>
          <i className="fa-solid fa-xl fa-circle-arrow-left"></i>
          <span> Previous</span>
        </chakra.div>
      </NextLink>
      <NextLink href={`/quizzes/${id}?page=${currentPage + 1}`}>
        <chakra.div visibility={currentPage < totalPages ? "visible" : "hidden"}>
          <span>Next </span>
          <i className="fa-solid fa-xl fa-circle-arrow-right"></i>
        </chakra.div>
      </NextLink>
    </Flex>
  )
}