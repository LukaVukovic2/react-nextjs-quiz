import { Button } from "@/styles/theme/components/button";
import { CloseButton, Drawer, DrawerContext, Flex } from "@chakra-ui/react";
import { cloneElement, isValidElement, ReactNode } from "react";
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
          <DrawerContext>
            {(store) => {
              const navigation = isValidElement(children)
                ? cloneElement(children, { closeDrawer: store.setOpen })
                : children;
              return (
                <>
                  <Drawer.CloseTrigger asChild>
                    <CloseButton size="sm" />
                  </Drawer.CloseTrigger>
                  <Drawer.Body>
                    <Flex
                      alignItems="flex-end"
                      direction="column"
                      flex={1}
                      gap={1}
                      my={12}
                    >
                      {navigation}
                    </Flex>
                  </Drawer.Body>
                </>
              );
            }}
          </DrawerContext>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
}
