import { toaster } from "@/components/ui/toaster";
import { Button } from "@/styles/theme/components/button";
import { logout } from "@/utils/actions/auth/logout";
import { Flex, Skeleton } from "@chakra-ui/react";
import { User } from "@supabase/supabase-js";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUserSecret } from "react-icons/fa";
import { LuLogIn, LuLogOut } from "react-icons/lu";
import styles from "./NavigationItems.module.css";

export const navItems = [
  { text: "Create Quiz", href: "/quizzes/new" },
  { text: "My Quizzes", href: "/my-quizzes" },
];

interface INavigationItemsProps {
  openDialog: () => void;
  user: User | null | undefined;
  username: string | null | undefined;
  closeDrawer?: (open: boolean) => void;
}

export default function NavigationItems({
  openDialog,
  user,
  username,
  closeDrawer
}: INavigationItemsProps) {
  const path = usePathname();

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      toaster.create({
        title: "Logged out successfully",
        type: "info",
        duration: 5000,
      });
    }
    closeDrawer && closeDrawer(false);
  };

  return (
    <>
      <Skeleton
        loading={username === undefined}
        height="30px"
        as={Flex}
        alignItems="center"
      >
        {username ? (
          <Link
            href="/my-profile"
            className={clsx({
              [styles.navLink]: true,
              [styles.active]: path === "/my-profile",
            })}
          >
            <Button
              visual="ghost"
              type="button"
              onClick={() => closeDrawer && closeDrawer(false)}
            >
              Hello, {username}
            </Button>
          </Link>
        ) : (
          <Flex
            alignItems="center"
            gap={2}
            className={styles.navLink}
          >
            <Button
              visual="ghost"
              type="button"
              onClick={openDialog}
            >
              Anonymous
              <FaUserSecret size={20} />
            </Button>
          </Flex>
        )}
      </Skeleton>

      {navItems.map((item) => {
        const activePath = path === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx({ [styles.navLink]: true, [styles.active]: activePath })}
          >
            <Button
              visual="ghost"
              type="button"
              color={activePath ? "tertiary" : "inherit"}
              onClick={() => closeDrawer && closeDrawer(false)}
            >
              {item.text}
            </Button>
          </Link>
        );
      })}
      <Skeleton
        loading={user === undefined}
        height="30px"
        as={Flex}
        justifyContent="flex-end"
        alignItems="center"
        flex={1}
      >
        {user?.is_anonymous === false ? (
          <Button
            visual="ghost"
            type="submit"
            className={styles.navLink}
            onClick={handleLogout}
          >
            Logout
            <LuLogOut />
          </Button>
        ) : (
          <Button
            visual="ghost"
            type="button"
            className={styles.navLink}
            onClick={openDialog}
          >
            Login
            <LuLogIn />
          </Button>
        )}
      </Skeleton>
    </>
  );
}