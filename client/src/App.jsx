import { Box, Heading, Text } from "@chakra-ui/react";

/**
 * Top-level application component.
 * Phase 1 renders a placeholder; the CRUD UI arrives in Phase 3.
 *
 * @returns {JSX.Element}
 */
export default function App() {
  return (
    <Box maxW="2xl" mx="auto" p={8}>
      <Heading size="lg">RentRedi User Management</Heading>
      <Text mt={2} color="gray.600">
        Client scaffold is running. The user CRUD interface arrives in Phase 3.
      </Text>
    </Box>
  );
}
