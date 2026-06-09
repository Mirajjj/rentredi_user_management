import { Box, Container, Heading, Stack, Text } from "@chakra-ui/react";

import { UsersPage } from "@pages/UsersPage";

/**
 * Top-level page: a header above the user-management feature.
 * @returns {JSX.Element}
 */
export function App() {
  return (
    <Container maxW="2xl" py={10}>
      <Stack gap={8}>
        <Box>
          <Heading size="xl">RentRedi User Management</Heading>
          <Text mt={1} color="fg.muted">
            Add users by name and zip — location and timezone are derived
            automatically.
          </Text>
        </Box>
        <UsersPage />
      </Stack>
    </Container>
  );
}
