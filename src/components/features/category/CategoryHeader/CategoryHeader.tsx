import StatBox from "@/components/core/StatBox/StatBox";
import { Flex, Heading } from "@chakra-ui/react";
import Image from "next/image";
import { BiJoystick } from "react-icons/bi";
import { BsTrophy } from "react-icons/bs";

interface ICategoryHeaderProps{
  categoryName: string | undefined;
  plays: number | undefined;
  quizCount: number;
}

export default function CategoryHeader({categoryName = "Category name", plays, quizCount}: ICategoryHeaderProps) {
  return (
    <Flex
      justifyContent="space-between"
      gap={6}
    >
      <Image
        src={`/category/${categoryName?.toLowerCase()}.png`}
        height="222"
        width="333"
        alt={categoryName}
        priority={true}
        style={{borderRadius: "0.375rem 0 0 0"}}
      />
      <Flex
        flexDir="column"
        justifyContent="space-evenly"
        flex={1}
      >
        <Heading
          as="h1"
          size="5xl"
        >
          {categoryName}
        </Heading>
        <StatBox title="Quiz count" value={quizCount || 0}>
          <BsTrophy size={20} />
        </StatBox>

        <StatBox title="Total plays" value={plays || 0}>
          <BiJoystick size={20} />
        </StatBox>
      </Flex>
    </Flex>
  );
}