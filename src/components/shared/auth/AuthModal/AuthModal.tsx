import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogRoot,
} from "@/components/ui/dialog";
import AuthForm from "../AuthForm/AuthForm";

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
  return (
    <DialogRoot
      open={dialogVisible}
      onOpenChange={(prev) => setDialogVisible(!prev)}
    >
      <DialogContent>
        <DialogBody>
          {children}
          <AuthForm closeModal={() => setDialogVisible(false)} />
        </DialogBody>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
}
