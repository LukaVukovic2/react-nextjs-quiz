import StatBox from "@/components/core/StatBox/StatBox";
import { Flex, Heading } from "@chakra-ui/react";
import Image from "next/image";
import { BiJoystick } from "react-icons/bi";
import { BsTrophy } from "react-icons/bs";
import styles from "./CategoryHeader.module.css";

interface ICategoryHeaderProps{
  categoryName: string | undefined;
  plays: number | undefined;
  quizCount: number;
}

export default function CategoryHeader({categoryName = "Category name", plays, quizCount}: ICategoryHeaderProps) {
  return (
    <Flex
      className={styles.container}
    >
      <Image
        className={styles.image}
        src={`/category/${categoryName?.toLowerCase()}.png`}
        height="222"
        width="333"
        alt={categoryName}
        priority={true}
      />
      <Flex
        className={styles.statContainer}
      >
        <Heading
          as="h1"
          className={styles.title}
        >
          {categoryName}
        </Heading>
        <StatBox title="Quiz count" value={quizCount || 0}>
          <BsTrophy />
        </StatBox>

        <StatBox title="Total plays" value={plays || 0}>
          <BiJoystick />
        </StatBox>
      </Flex>
    </Flex>
  );
}