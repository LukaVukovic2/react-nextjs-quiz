import { DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ReactNode } from "react";

interface IDialogContentWrapper {
  title: string;
  body?: ReactNode;
  footer?: ReactNode;
}

export const DialogContentWrapper = ({ title, body, footer }: IDialogContentWrapper) => {
  return (
    <DialogContent>
      <DialogCloseTrigger />
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      {body && (
        <DialogBody>
          {body}
        </DialogBody>
      )}
      {footer && (
        <DialogFooter>
          {footer}
        </DialogFooter>
      )}
    </DialogContent>
  );
};