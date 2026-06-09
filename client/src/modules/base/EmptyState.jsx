import { Spinner, Stack, Text } from "@chakra-ui/react";

/**
 * Centered status block for a data region's loading / empty / error branches.
 *
 * @param {object} props
 * @param {string} props.message
 * @param {boolean} [props.loading] render a spinner above the message
 * @param {"muted"|"error"} [props.tone="muted"]
 * @returns {JSX.Element}
 */
export function EmptyState({ message, loading, tone = "muted" }) {
  return (
    <Stack align="center" gap={3} py={10} color={tone === "error" ? "red.600" : "fg.muted"}>
      {loading && <Spinner color="brand.solid" />}
      <Text>{message}</Text>
    </Stack>
  );
}
