import { Button } from "@/styles/theme/components/button";
import { Drawer, Flex } from "@chakra-ui/react";
import { ReactNode } from "react";
import { GiHamburgerMenu } from "react-icons/gi";

export default function SidebarNavigation({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Drawer.Root>
      <Drawer.Backdrop />
      <Drawer.Trigger asChild>
        <Button visual="ghost">
          <GiHamburgerMenu />
        </Button>
      </Drawer.Trigger>
      <Drawer.Positioner>
        <Drawer.Content>
          <Drawer.CloseTrigger />
          <Drawer.Header>
            <Drawer.Title />
          </Drawer.Header>
          <Drawer.Body>
            <Flex
              alignItems="flex-end"
              direction="column"
            >
              {children}
            </Flex>
          </Drawer.Body>
          <Drawer.Footer />
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
}