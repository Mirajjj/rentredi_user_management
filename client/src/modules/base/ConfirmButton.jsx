import { Button, Dialog, Portal } from "@chakra-ui/react";

/**
 * Button that opens a confirm dialog before firing `onConfirm`. Uncontrolled —
 * the dialog manages its own open state; the action trigger closes it.
 *
 * @param {object} props
 * @param {() => void} props.onConfirm
 * @param {string} props.children       trigger button label
 * @param {string} [props.title="Are you sure?"]
 * @param {string} [props.description]
 * @param {string} [props.confirmLabel="Confirm"]
 * @param {boolean} [props.loading]      disables the trigger while pending
 * @returns {JSX.Element}
 */
export function ConfirmButton({
  onConfirm,
  children,
  title = "Are you sure?",
  description,
  confirmLabel = "Confirm",
  loading,
}) {
  return (
    <Dialog.Root role="alertdialog">
      <Dialog.Trigger asChild>
        <Button size="sm" variant="outline" colorPalette="red" loading={loading}>
          {children}
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>
            {description && (
              <Dialog.Body>
                <Dialog.Description>{description}</Dialog.Description>
              </Dialog.Body>
            )}
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Dialog.ActionTrigger asChild>
                <Button colorPalette="red" onClick={onConfirm}>
                  {confirmLabel}
                </Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
