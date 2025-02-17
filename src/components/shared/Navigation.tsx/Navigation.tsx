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
import {
  getCookie
} from 'cookies-next';

export default function Navigation() {
  const path = usePathname();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    setIsAnonymous(getCookie("isAnonymous") === "true");
  });
  
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
      { 
        !isAnonymous ?
        (
          <div>
            <Button
              visual="ghost"
              type="submit"
              className="nav-link"
              onClick={() => logout()}
            >
              Logout
              <LuLogOut />
            </Button>
          </div>
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
        )
      }
      {
        dialogVisible && (
          <AuthModal
            dialogVisible={dialogVisible}
            setDialogVisible={setDialogVisible}
          />
        )
      }
    </Flex>
  );
}