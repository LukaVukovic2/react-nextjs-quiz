import { ReactNode } from "react";
import { CloseButton, Dialog, Portal } from "@chakra-ui/react";

interface IDialogContentWrapper {
  title: string;
  body?: ReactNode;
  footer?: ReactNode;
}

export const DialogContentWrapper = ({ title, body, footer }: IDialogContentWrapper) => {
  return (
    <Portal>
      <Dialog.Backdrop />
        <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.CloseTrigger />
          <Dialog.Header>
            <Dialog.Title>{title}</Dialog.Title>
          </Dialog.Header>
          {body && (
            <Dialog.Body>
              {body}
            </Dialog.Body>
          )}
          {footer && (
            <Dialog.Footer>
              {footer}
            </Dialog.Footer>
          )}
          <Dialog.CloseTrigger asChild>
            <CloseButton size="sm" />
          </Dialog.CloseTrigger>
        </Dialog.Content>
      </Dialog.Positioner>
    </Portal>
  );
};