import { Badge, Box, Flex, Grid, Stack, Text } from "@chakra-ui/react";

import { Avatar } from "@base/index";
import { cityState, tzChip } from "@modules/users/format";

/**
 * @typedef {import('@lib/api/types').User} User
 */

/**
 * @param {object} props
 * @param {string} props.label
 * @param {string} props.value
 * @returns {JSX.Element}
 */
function Stat({ label, value }) {
  return (
    <Box bg="bg.subtle" px="2.5" py="2">
      <Text
        fontSize="10.5px"
        textTransform="uppercase"
        letterSpacing="0.05em"
        color="fg.subtle"
        fontWeight="600"
      >
        {label}
      </Text>
      <Text fontFamily="mono" fontSize="12.5px" color="fg" mt="0.5">
        {value}
      </Text>
    </Box>
  );
}

/**
 * A single user as a card: avatar + name + location + tz chip, and a 2-up
 * stat grid (zip, coordinates). The whole card opens the drawer.
 * @param {object} props
 * @param {User} props.user
 * @param {(user: User) => void} props.onSelect
 * @param {boolean} [props.selected]
 * @returns {JSX.Element}
 */
export function UserCard({ user, onSelect, selected }) {
  return (
    <Box
      onClick={() => onSelect(user)}
      cursor="pointer"
      bg="bg.panel"
      borderWidth="1px"
      borderColor="border.subtle"
      borderRadius="lg"
      p="4"
      boxShadow={selected ? "0 0 0 2px var(--chakra-colors-brand-solid)" : "xs"}
      transition="box-shadow .14s, transform .06s"
      _hover={{
        boxShadow: selected
          ? "0 0 0 2px var(--chakra-colors-brand-solid)"
          : "md",
        transform: "translateY(-1px)",
      }}
    >
      <Flex align="center" gap="3" mb="3.5">
        <Avatar name={user.name} size={38} />
        <Stack gap="0" minW="0">
          <Text fontWeight="600" letterSpacing="-0.01em">
            {user.name}
          </Text>
          <Text fontSize="12.5px" color="fg.muted">
            {cityState(user)}
          </Text>
        </Stack>
        <Badge
          ml="auto"
          bg="brand.subtle"
          color="brand.fg"
          borderRadius="full"
          px="2"
        >
          <Text fontFamily="mono" fontSize="11.5px">
            {tzChip(user.timezone)}
          </Text>
        </Badge>
      </Flex>
      <Grid
        templateColumns="1fr 1fr"
        gap="1px"
        bg="border.subtle"
        borderRadius="8px"
        overflow="hidden"
        borderWidth="1px"
        borderColor="border.subtle"
      >
        <Stat label="Zip" value={user.zipCode} />
        <Stat
          label="Coordinates"
          value={`${user.latitude.toFixed(2)}, ${user.longitude.toFixed(2)}`}
        />
      </Grid>
    </Box>
  );
}
