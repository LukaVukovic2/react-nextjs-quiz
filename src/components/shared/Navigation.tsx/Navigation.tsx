"use client";
import Link from "next/link";
import { navItems } from "../utils/navigation-items";
import { Flex, Image, chakra } from "@chakra-ui/react";
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

export default function Navigation() {
  const path = usePathname();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState<boolean | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user.is_anonymous === false) {
        setIsAnonymous(false);
      } else {
        setIsAnonymous(true);
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
      <chakra.div width="100px">
        <Image
          src="/logo.svg"
          alt="logo"
          height="45px"
        />
      </chakra.div>
      <Flex gap={2}>
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
                color={clsx({ "{colors.tertiary}": activePath })}
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
      {dialogVisible && (
        <AuthModal
          dialogVisible={dialogVisible}
          setDialogVisible={setDialogVisible}
        />
      )}
    </Flex>
  );
}
