import { Box, Button, Heading, Stack, Text } from "@chakra-ui/react";
import { Plus, Search, Users } from "lucide-react";
import { useUsersContext } from "@modules/users/context";

/**
 * Empty / no-results state for the list region.
 *  - `empty`: nothing in the directory yet — gradient tile + primary CTA.
 *  - `no-results`: a search miss — search glyph + "Clear search".
 * @param {object} props
 * @param {'empty' | 'no-results'} props.kind
 * @returns {JSX.Element}
 */
export function ListEmpty({ kind }) {
  const { searchQuery, setSearchQuery, openModal } = useUsersContext();

  if (kind === "no-results") {
    return (
      <Stack align="center" textAlign="center" px="6" py="20" gap="0">
        <Box
          boxSize="52px"
          borderRadius="12px"
          bg="bg.subtle"
          borderWidth="1px"
          borderColor="border.subtle"
          display="grid"
          placeItems="center"
          color="fg.subtle"
        >
          <Search size={22} />
        </Box>
        <Heading size="md" mt="4.5" mb="1.5" letterSpacing="-0.02em">
          No users match “{searchQuery}”
        </Heading>
        <Text fontSize="14px" color="fg.muted" mb="4.5">
          Try a different name, city, or zip code.
        </Text>
        <Button variant="outline" onClick={() => setSearchQuery("")}>
          Clear search
        </Button>
      </Stack>
    );
  }

  return (
    <Stack height="100%" alignItems="center" justifyContent="center" display="flex">
      <Stack align="center" textAlign="center" px="6" py="18" gap="1">
        <Box
          boxSize="56px"
          borderRadius="14px"
          backgroundImage="linear-gradient(135deg, #635BFF, #ec4899)"
          display="grid"
          placeItems="center"
          color="white"
          boxShadow="0 8px 24px rgba(99,91,255,.32)"
          mb="2"
        >
          <Users size={26} strokeWidth={2} />
        </Box>
        <Heading size="lg" mt="2" mb="2" letterSpacing="-0.025em">
          Add your first user to get started
        </Heading>
        <Text fontSize="15px" color="fg.muted" maxW="380px" lineHeight="1.55" mb="6">
          Enter a name and a zip code. We’ll resolve the city, timezone, and coordinates
          automatically.
        </Text>
        <Button size="lg" colorPalette="brand" onClick={openModal}>
          <Plus size={17} /> Add a user
        </Button>
      </Stack>
    </Stack>
  );
}
