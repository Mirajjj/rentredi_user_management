import { createToaster } from "@chakra-ui/react";

// One app-wide toaster instance (Chakra v3 replaces v2's `useToast` hook with a
// standalone store + a portal component). Call `toaster.create({...})` from
// anywhere; render <AppToaster/> once near the app root.
export const toaster = createToaster({
  placement: "bottom-end",
  gap: 12,
});
