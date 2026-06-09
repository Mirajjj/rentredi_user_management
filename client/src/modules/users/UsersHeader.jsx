import { Box, Button, Flex, Heading, Input, InputGroup, Stack, Text } from "@chakra-ui/react";
import { Plus, Search, SlidersHorizontal } from "lucide-react";

import { SegmentedToggle } from "@base/index";
import { useUsersContext } from "@modules/users/context";

const LAYOUT_OPTIONS = [
  { value: "table", label: "Table" },
  { value: "cards", label: "Cards" },
];

/**
 * The list header: title + a "{n} people · {m} cities · enriched from zip"
 * subtitle, the Add-user button, the search input, a visual-only Filter
 * button, and the Table/Cards layout toggle.
 * @returns {JSX.Element}
 */
export function UsersHeader() {
  const {
    count,
    cityCount,
    searchQuery,
    setSearchQuery,
    openModal,
    areaLayout,
    setAreaLayout,
  } = useUsersContext();
  return (
    <Box px="7" pt="5" pb="4" borderBottomWidth="1px" borderColor="border.subtle" bg="bg.panel">
      <Flex align="flex-start" justify="space-between" gap="4">
        <Stack gap="1">
          <Heading size="lg" letterSpacing="-0.025em">
            Users
          </Heading>
          <Text fontSize="13.5px" color="fg.subtle">
            {count} {count === 1 ? "person" : "people"} · {cityCount}{" "}
            {cityCount === 1 ? "city" : "cities"} · enriched from zip
          </Text>
        </Stack>
        <Button colorPalette="brand" onClick={openModal}>
          <Plus size={16} /> Add user
        </Button>
      </Flex>

      <Flex align="center" gap="2.5" mt="4">
        <InputGroup flex="1" maxW="360px" startElement={<Search size={15} />}>
          <Input
            placeholder="Search name, city, or zip…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            height="38px"
            bg="bg.panel"
          />
        </InputGroup>
        <Button variant="outline" size="sm" height="38px" color="fg.muted">
          <SlidersHorizontal size={15} /> Filter
        </Button>
        <Box ml="auto">
          <SegmentedToggle
            options={LAYOUT_OPTIONS}
            value={areaLayout}
            onChange={setAreaLayout}
            ariaLabel="List layout"
          />
        </Box>
      </Flex>
    </Box>
  );
}
