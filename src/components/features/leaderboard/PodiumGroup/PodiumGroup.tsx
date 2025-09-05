import { Box } from "@chakra-ui/react";
import styles from "../QuizLeaderboard/QuizLeaderboard.module.css";
import { ReactNode } from "react";

export default function PodiumGroup({children}: {children: ReactNode}) {
  return (
    <Box
      as="ul"
      className={styles.flexRow}
    >
      {children}
    </Box>
  );
}