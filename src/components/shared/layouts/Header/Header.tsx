"use client";
import Link from "next/link";
import { Flex, SkeletonText } from "@chakra-ui/react";
import { Logo } from "@/components/core/Logo/Logo";
import { useEffect, useState } from "react";
import AuthModal from "../../auth/AuthModal/AuthModal";
import styles from "./Header.module.css";
import SidebarNavigation from "../../navigations/SidebarNavigation/SidebarNavigation";
import { useMediaQuery } from "usehooks-ts";
import NavigationItems from "../../navigations/NavigationItems/NavigationItems";
import { useUser } from "@/utils/hooks/useUser";

export const navItems = [
  { text: "Create Quiz", href: "/quizzes/new" },
  { text: "My Quizzes", href: "/my-quizzes" },
];

export default function Header() {
  const [isMounted, setIsMounted] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const desktopMode = useMediaQuery("(min-width: 768px)");
  const { user, username } = useUser();
  useEffect(() => {
    setIsMounted(true);
  }, []);
  const openDialog = () => setDialogVisible(true);
  const navigation = <NavigationItems openDialog={openDialog} user={user} username={username}/> 

  return (
    <Flex
      justifyContent="space-between"
      className={styles.header}
      alignItems="center"
      gap={2}
    >
      <Flex flex={1}>
        <Link href="/">
          <Logo height="45px" />
        </Link>

        {isMounted ? (
          desktopMode ? (
            <Flex alignItems="center">
              {navigation}
            </Flex>
          ) : (
            <SidebarNavigation>
              {navigation}
            </SidebarNavigation>
          )
        ) : (
          <SkeletonText
            noOfLines={1}
            flex={1}
            m={2}
            width="50%"
          />
        )}
      </Flex>

      {dialogVisible && (
        <AuthModal
          dialogVisible={dialogVisible}
          setDialogVisible={setDialogVisible}
        />
      )}
    </Flex>
  );
}
