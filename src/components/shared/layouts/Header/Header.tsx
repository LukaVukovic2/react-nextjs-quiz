"use client";
import Link from "next/link";
import { Flex } from "@chakra-ui/react";
import { Logo } from "@/components/core/Logo/Logo";
import { useEffect, useState } from "react";
import AuthModal from "../../auth/AuthModal/AuthModal";
import styles from "./Header.module.css";
import SidebarNavigation from "../../navigations/SidebarNavigation/SidebarNavigation";
import { useMediaQuery } from "usehooks-ts";
import NavigationItems from "../../navigations/NavigationItems/NavigationItems";
import { useUser } from "@/utils/hooks/useUser";
import SkeletonNavigation from "../../navigations/SkeletonNavigation/SkeletonNavigation";

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
  const navigation = (
    <NavigationItems
      openDialog={openDialog}
      user={user}
      username={username}
    />
  );

  return (
    <Flex
      className={styles.header}
      alignItems="center"
      justifyContent="center"
    >
      <Flex
        flex={1}
        maxWidth="1000px"
        gap={2}
      >
        <Link href="/">
          <Logo
            height="45px"
          />
        </Link>
        {
          isMounted ? (
            desktopMode ? (
              <Flex
                alignItems="center"
                justifyContent="space-between"
                flex={1}
              >
                {navigation}
              </Flex>
            ) : (
              <Flex
                flex={1}
                justifyContent="flex-end"
              >
                <SidebarNavigation>{navigation}</SidebarNavigation>
              </Flex>
            )
          ) : <SkeletonNavigation />
        }
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
