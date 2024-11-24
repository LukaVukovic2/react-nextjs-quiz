"use client";
import Link from "next/link";
import { navItems } from "../utils/navigation-items";
import { Flex, Image } from "@chakra-ui/react";
import { Button } from "@/styles/theme/components/button";
import { LuLogOut } from "react-icons/lu";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import "./Navigation.css";

export default function Navigation() {
  const path = usePathname();
  return (
    <Flex
      as="nav"
      justifyContent="space-between"
      alignItems="center"
      className="navigation"
    >
      <Image
        src="/logo.svg"
        alt="logo"
        height="45px"
      />
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
    </Flex>
  );
}
