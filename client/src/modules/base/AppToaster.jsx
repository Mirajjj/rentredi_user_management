import { CloseButton, Toaster, Toast, Stack, Spinner } from "@chakra-ui/react";
import { CheckCircle2, AlertCircle, Bell } from "lucide-react";

import { toaster } from "@base/toaster";

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Bell,
};

const ICON_COLORS = {
  success: { bg: "success.subtle", fg: "success.solid" },
  error: { bg: "error.subtle", fg: "error.solid" },
  info: { bg: "brand.subtle", fg: "brand.solid" },
};

/**
 * Renders the app-wide toast stack from the shared `toaster` store.
 * Mount once near the root; trigger toasts via `toaster.create(...)`.
 * @returns {JSX.Element}
 */
export function AppToaster() {
  return (
    <Toaster toaster={toaster} insetInline={{ mdDown: "4" }}>
      {(toast) => {
        const type = toast.type ?? "info";
        const Icon = ICONS[type] ?? Bell;
        const palette = ICON_COLORS[type] ?? ICON_COLORS.info;
        return (
          <Toast.Root
            width={{ base: "auto", md: "sm" }}
            bg="bg.panel"
            color="fg"
            borderWidth="1px"
            borderColor="border.subtle"
            borderRadius="lg"
            boxShadow="md"
            p="3.5"
          >
            <Stack
              direction="row"
              gap="3"
              align="flex-start"
              width="full"
            >
              {type === "loading" ? (
                <Spinner size="sm" color="brand.solid" mt="0.5" />
              ) : (
                <Stack
                  align="center"
                  justify="center"
                  boxSize="26px"
                  borderRadius="7px"
                  flexShrink={0}
                  bg={palette.bg}
                  color={palette.fg}
                >
                  <Icon size={16} strokeWidth={2.2} />
                </Stack>
              )}
              <Stack gap="0.5" flex="1" minW="0">
                {toast.title && (
                  <Toast.Title fontSize="sm" fontWeight="600">
                    {toast.title}
                  </Toast.Title>
                )}
                {toast.description && (
                  <Toast.Description fontSize="xs" color="fg.muted">
                    {toast.description}
                  </Toast.Description>
                )}
              </Stack>
              <Toast.CloseTrigger asChild>
                <CloseButton size="xs" />
              </Toast.CloseTrigger>
            </Stack>
          </Toast.Root>
        );
      }}
    </Toaster>
  );
}
