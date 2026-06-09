import { Box, Button, Flex, Heading, Input, InputGroup, Stack, Text } from "@chakra-ui/react";
import { Plus, Search, SlidersHorizontal } from "lucide-react";

import { SegmentedToggle } from "@base/index";

const LAYOUT_OPTIONS = [
  { value: "table", label: "Table" },
  { value: "cards", label: "Cards" },
];

/**
 * The list header: title + a "{n} people · {m} cities · enriched from zip"
 * subtitle, the Add-user button, the search input, a visual-only Filter
 * button, and the Table/Cards layout toggle.
 * @param {object} props
 * @param {number} props.count   total users
 * @param {number} props.cities  distinct city/state pairs
 * @param {string} props.query
 * @param {(value: string) => void} props.onQuery
 * @param {() => void} props.onAdd
 * @param {'table' | 'cards'} props.layout
 * @param {(layout: string) => void} props.onLayout
 * @returns {JSX.Element}
 */
export function UsersHeader({ count, cities, query, onQuery, onAdd, layout, onLayout }) {
  return (
    <Box px="7" pt="5" pb="4" borderBottomWidth="1px" borderColor="border.subtle" bg="bg.panel">
      <Flex align="flex-start" justify="space-between" gap="4">
        <Stack gap="1">
          <Heading size="lg" letterSpacing="-0.025em">
            Users
          </Heading>
          <Text fontSize="13.5px" color="fg.subtle">
            {count} {count === 1 ? "person" : "people"} · {cities}{" "}
            {cities === 1 ? "city" : "cities"} · enriched from zip
          </Text>
        </Stack>
        <Button colorPalette="brand" onClick={onAdd}>
          <Plus size={16} /> Add user
        </Button>
      </Flex>

      <Flex align="center" gap="2.5" mt="4">
        <InputGroup flex="1" maxW="360px" startElement={<Search size={15} />}>
          <Input
            placeholder="Search name, city, or zip…"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
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
            value={layout}
            onChange={onLayout}
            ariaLabel="List layout"
          />
        </Box>
      </Flex>
    </Box>
  );
}
