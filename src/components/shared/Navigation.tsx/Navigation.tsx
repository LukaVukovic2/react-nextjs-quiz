"use client";
import Link from "next/link";
import { navItems } from "../utils/navigation-items";
import { Flex } from "@chakra-ui/react";
import { Button } from "@/styles/theme/components/button";
import { LuLogIn, LuLogOut } from "react-icons/lu";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import "./Navigation.css";
import { useEffect, useState } from "react";
import AuthModal from "../AuthModal/AuthModal";
import { logout } from "../utils/actions/auth/logout";
import { toaster } from "@/components/ui/toaster";
import { createClient } from "../utils/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { FaUserSecret } from "react-icons/fa";
import { Logo } from "@/components/core/Logo/Logo";

export default function Navigation() {
  const path = usePathname();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState<boolean | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const supabase = createClient();
  const getUsername = async (userid: string) => {
    const { data: username } = await supabase.rpc("get_username", { userid });
    return username;
  };

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user.is_anonymous === false) {
        setIsAnonymous(false);
        getUsername(session?.user.id).then((username) => {
          setUsername(username);
        });
      } else {
        setIsAnonymous(true);
        setUsername("");
      }
    });
    return () => data.subscription.unsubscribe();
  });

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
          <Logo height="45px"/>
        </Link>
        
        <Skeleton
          loading={username === null}
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
              })}
            >
              <Button
                visual="ghost"
                type="button"
              >
                Hello, {username}
              </Button>
            </Link>) : 
            <Flex alignItems="center" gap={2} className="nav-link">
              <Button visual="ghost" type="button" onClick={() => setDialogVisible(true)}>
                Anonymous
                <FaUserSecret size={20} />
              </Button>
            </Flex>
          }
        </Skeleton>
        
        {navItems.map((item) => {
          const activePath = path === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx({
                "nav-link": true,
                active: activePath,
              })}
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
        loading={isAnonymous === null}
        height="30px"
        as={Flex}
        justifyContent="center"
        alignItems="center"
      >
        {!isAnonymous ? (
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
            onClick={() => setDialogVisible(true)}
          >
            Login
            <LuLogIn />
          </Button>
        )}
      </Skeleton>

      {dialogVisible && <AuthModal dialogVisible={dialogVisible} setDialogVisible={setDialogVisible} />}
    </Flex>
  );
}