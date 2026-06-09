import { Badge, Box, Flex, Stack, Text } from "@chakra-ui/react";
import { Users } from "lucide-react";

import { Avatar } from "@base/Avatar";
import { Logo } from "@base/Logo";
import { useAPIUsers } from "@lib/api/queries/use-api-users";

/**
 * App sidebar: brand, a single active "Users" nav item carrying the live count
 * badge (from the shared users query — TanStack Query dedupes the fetch), and a
 * static account card.
 * @returns {JSX.Element}
 */
export function Sidebar() {
  const { data: users } = useAPIUsers();
  const count = users?.length ?? 0;

  return (
    <Box
      as="aside"
      width="232px"
      flexShrink={0}
      borderRightWidth="1px"
      borderColor="border.subtle"
      bg="bg.panel"
      display="flex"
      flexDirection="column"
      height="100%"
    >
      <Box px="4.5" pt="4.5" pb="3.5">
        <Logo size={26} />
      </Box>

      <Box px="3" py="1.5" flex="1">
        <Flex
          align="center"
          gap="2.5"
          px="2.5"
          py="2"
          borderRadius="7px"
          fontSize="13.5px"
          fontWeight="600"
          color="brand.fg"
          bg="brand.subtle"
        >
          <Users size={17} strokeWidth={1.9} />
          <Text>Users</Text>
          <Badge
            ml="auto"
            bg="bg.panel"
            color="brand.solid"
            borderWidth="1px"
            borderColor="border.subtle"
            borderRadius="full"
            px="2"
            fontSize="11px"
            fontWeight="600"
          >
            {count}
          </Badge>
        </Flex>
      </Box>

      <Box p="3" borderTopWidth="1px" borderColor="border.subtle">
        <Flex align="center" gap="2.5" px="2" py="1.5">
          <Avatar name="Avery Cole" size={32} />
          <Stack gap="0" minW="0">
            <Text fontSize="13px" fontWeight="600" lineClamp={1}>
              Avery Cole
            </Text>
            <Text fontSize="11.5px" color="fg.subtle" lineClamp={1}>
              Property manager
            </Text>
          </Stack>
        </Flex>
      </Box>
    </Box>
  );
}
