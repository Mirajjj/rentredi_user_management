import { Badge, Box, Flex, Stack, Table, Text } from "@chakra-ui/react";
import { ChevronRight, Clock, Compass } from "lucide-react";

import { Avatar } from "@base/index";
import { HEAD } from "@modules/users/UserTable/constants";
import { useUsersContext } from "@modules/users/context";
import { cityState, tzChip } from "@/modules/users/utils";

/**
 * @typedef {import('@lib/api/types').User} User
 */

/**
 * Dense table of users. The whole row is the click target (opens the drawer);
 * the selected row keeps a brand-tinted background.
 * @returns {JSX.Element}
 */
export function UserTable() {
  const { filtered, select, selected } = useUsersContext();
  return (
    <Table.Root size="md" fontSize="14px">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader {...HEAD} pl="6">
            Name
          </Table.ColumnHeader>
          <Table.ColumnHeader {...HEAD}>Zip</Table.ColumnHeader>
          <Table.ColumnHeader {...HEAD}>Location</Table.ColumnHeader>
          <Table.ColumnHeader {...HEAD}>Timezone</Table.ColumnHeader>
          <Table.ColumnHeader {...HEAD}>Coordinates</Table.ColumnHeader>
          <Table.ColumnHeader {...HEAD} pr="5" />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {filtered.map((u) => {
          const isSelected = u.id === selected?.id;
          return (
            <Table.Row
              key={u.id}
              onClick={() => select(u)}
              cursor="pointer"
              bg={isSelected ? "brand.subtle" : "transparent"}
              _hover={{ bg: isSelected ? "brand.subtle" : "bg.subtle" }}
            >
              <Table.Cell pl="6">
                <Flex align="center" gap="3">
                  <Avatar name={u.name} size={32} />
                  <Stack gap="0">
                    <Text fontWeight="600" letterSpacing="-0.01em" whiteSpace="nowrap">
                      {u.name}
                    </Text>
                    <Text fontFamily="mono" fontSize="11px" color="fg.subtle">
                      {u.id}
                    </Text>
                  </Stack>
                </Flex>
              </Table.Cell>
              <Table.Cell>
                <Text fontFamily="mono" color="fg.muted">
                  {u.zipCode}
                </Text>
              </Table.Cell>
              <Table.Cell color="fg" fontWeight="500" whiteSpace="nowrap">
                {cityState(u)}
              </Table.Cell>
              <Table.Cell>
                <Badge
                  bg="brand.subtle"
                  color="brand.fg"
                  borderRadius="full"
                  px="2"
                  gap="1"
                >
                  <Clock size={12} strokeWidth={2.2} />
                  <Text fontFamily="mono" fontSize="11.5px">
                    {tzChip(u.timezone)}
                  </Text>
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Flex align="center" gap="2">
                  <Box
                    display="grid"
                    placeItems="center"
                    boxSize="20px"
                    borderRadius="5px"
                    bg="brand.subtle"
                    color="brand.solid"
                    flexShrink={0}
                  >
                    <Compass size={13} />
                  </Box>
                  <Text
                    fontFamily="mono"
                    color="fg.muted"
                    fontSize="12.5px"
                    whiteSpace="nowrap"
                  >
                    {u.latitude.toFixed(4)}, {u.longitude.toFixed(4)}
                  </Text>
                </Flex>
              </Table.Cell>
              <Table.Cell pr="5" textAlign="right">
                <Box as="span" color="fg.subtle">
                  <ChevronRight size={16} />
                </Box>
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table.Root>
  );
}
