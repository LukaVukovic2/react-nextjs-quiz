"use client";
import Link from "next/link";
import { navItems } from "../utils/navigation-items";
import { Flex, Image, chakra } from "@chakra-ui/react";
import { Button } from "@/styles/theme/components/button";
import { LuLogIn, LuLogOut } from "react-icons/lu";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import "./Navigation.css";

export default function Navigation() {
  const path = usePathname();
  const isAnonymous = localStorage.getItem("isAnonymous");
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
          const isDisabled = isAnonymous && item.text !== "Home";
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
                disabled={!!isDisabled}
              >
                {item.text}
              </Button>
            </Link>
          );
        })}
      </Flex>
      { 
        !isAnonymous ?
        (
          <div>
            <form
              action="/auth/logout"
              method="post"
            >
              <Button
                visual="ghost"
                type="submit"
                className="nav-link"
              >
                Logout
                <LuLogOut />
              </Button>
            </form>
          </div>
        ) : (
          <Link href="#">
            <Button
              visual="ghost"
              type="button"
              className="nav-link"
            >
              Login
              <LuLogIn />
            </Button>
          </Link>
        )
      }
    </Flex>
  );
}
