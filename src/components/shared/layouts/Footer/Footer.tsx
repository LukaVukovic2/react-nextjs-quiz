import { Logo } from "@/components/core/Logo/Logo";
import styles from "./Footer.module.css";
import { Flex } from "@chakra-ui/react";

export default function Footer(){
  return(
    <footer className={styles.footer}>
      <Flex gap={2}>
        <Logo height="25px"/>
        <p>Quiz App</p>
      </Flex>
      <div>Luka Vuković 2025</div>
    </footer>
  )
}