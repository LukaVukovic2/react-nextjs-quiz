import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogRoot,
} from "@/components/ui/dialog";
import AuthForm from "../AuthForm/AuthForm";
import { useMediaQuery } from "usehooks-ts";
import { Flex } from "@chakra-ui/react";

interface IAuthModalProps {
  dialogVisible: boolean;
  setDialogVisible: (visible: boolean) => void;
  children?: React.ReactNode;
}

export default function AuthModal({
  dialogVisible,
  setDialogVisible,
  children,
}: IAuthModalProps) {
  const mobileMode = useMediaQuery("(max-width: 576px)");
  return (
    <DialogRoot
      open={dialogVisible}
      onOpenChange={(prev) => setDialogVisible(!prev)}
      size={mobileMode ? "full" : "md"}
    >
      <DialogContent>
        <DialogBody as={Flex} flexDirection="column" justifyContent="center">
          {children}
          <AuthForm closeModal={() => setDialogVisible(false)} />
        </DialogBody>
        <DialogCloseTrigger border="4px solid white" />
      </DialogContent>
    </DialogRoot>
  );
}
