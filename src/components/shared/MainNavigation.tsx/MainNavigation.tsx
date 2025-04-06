"use client";
import Link from "next/link";
import { Flex } from "@chakra-ui/react";
import { Button } from "@/styles/theme/components/button";
import { LuLogIn, LuLogOut } from "react-icons/lu";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import "./MainNavigation.css";
import { useState } from "react";
import AuthModal from "../AuthModal/AuthModal";
import { logout } from "@/utils/actions/auth/logout";
import { toaster } from "@/components/ui/toaster";
import { Skeleton } from "@/components/ui/skeleton";
import { FaUserSecret } from "react-icons/fa";
import { Logo } from "@/components/core/Logo/Logo";
import { useUser } from "@/utils/hooks/useUser";

export const navItems = [
  { text: 'Create Quiz', href: '/quizzes/new' },
  { text: 'My Quizzes', href: '/my-quizzes' },
];

export default function MainNavigation() {
  const path = usePathname();
  const [dialogVisible, setDialogVisible] = useState(false);
  const { user, username } = useUser();

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      toaster.create({
        title: "Logged out successfully",
        type: "info",
        duration: 5000,
      });
    }
  };
  const openDialog = () => setDialogVisible(true);

  return (
    <Flex
      as="nav"
      justifyContent="space-between"
      alignItems="center"
      className="navigation"
    >
      <Flex
        alignItems="center"
        gap={2}
      >
        <Link href="/">
          <Logo height="45px" />
        </Link>

        <Skeleton
          loading={username === undefined}
          height="30px"
          as={Flex}
          alignItems="center"
        >
          {
            username ? (
            <Link
              href="/my-profile"
              className={clsx({
                "nav-link": true,
                active: path === "/my-profile",
              })}
            >
              <Button
                visual="ghost"
                type="button"
              >
                Hello, {username}
              </Button>
            </Link>
          ) : (
            <Flex
              alignItems="center"
              gap={2}
              className="nav-link"
            >
              <Button
                visual="ghost"
                type="button"
                onClick={() => setDialogVisible(true)}
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
              className={clsx({ "nav-link": true, active: activePath })}
            >
              <Button
                visual="ghost"
                type="button"
                color={activePath ? "tertiary" : "inherit"}
              >
                {item.text}
              </Button>
            </Link>
          );
        })}
      </Flex>

      <Skeleton
        loading={user === undefined}
        height="30px"
        as={Flex}
        justifyContent="center"
        alignItems="center"
      >
        {user?.is_anonymous === false ? (
          <Button
            visual="ghost"
            type="submit"
            className="nav-link"
            onClick={handleLogout}
          >
            Logout
            <LuLogOut />
          </Button>
        ) : (
          <Button
            visual="ghost"
            type="button"
            className="nav-link"
            onClick={openDialog}
          >
            Login
            <LuLogIn />
          </Button>
        )}
      </Skeleton>

      {dialogVisible && (
        <AuthModal
          dialogVisible={dialogVisible}
          setDialogVisible={setDialogVisible}
        />
      )}
    </Flex>
  );
}