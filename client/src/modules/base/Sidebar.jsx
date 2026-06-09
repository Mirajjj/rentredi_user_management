import { Badge, Box, Flex, Stack, Text } from "@chakra-ui/react";
import { Users } from "lucide-react";
import { Link as RouterLink, useMatch } from "react-router-dom";

import { Avatar } from "@base/Avatar";
import { Logo } from "@base/Logo";
import { useAPIUsers } from "@lib/api/queries/use-api-users";

/**
 * App sidebar: brand, a "Users" nav link carrying the live count badge (from the
 * shared users query — TanStack Query dedupes the fetch), and a static account
 * card. The link's active styling is driven by the current route.
 * @returns {JSX.Element}
 */
export function Sidebar() {
  const { data: users } = useAPIUsers();
  const count = users?.length ?? 0;
  const active = Boolean(useMatch("/users"));

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
          asChild
          align="center"
          gap="2.5"
          px="2.5"
          py="2"
          borderRadius="7px"
          fontSize="13.5px"
          fontWeight={active ? "600" : "500"}
          color={active ? "brand.fg" : "fg.muted"}
          bg={active ? "brand.subtle" : "transparent"}
          textDecoration="none"
          _hover={{
            textDecoration: "none",
            bg: active ? "brand.subtle" : "bg.subtle",
          }}
        >
          <RouterLink to="/users">
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
          </RouterLink>
        </Flex>
      </Box>

      <Box p="3" borderTopWidth="1px" borderColor="border.subtle">
        <Flex align="center" gap="2.5" px="2" py="1.5">
          <Avatar name="Super Admin" size={32} />
          <Stack gap="0" minW="0">
            <Text fontSize="13px" fontWeight="600" lineClamp={1}>
              Super Admin
            </Text>
            <Text fontSize="11.5px" color="fg.subtle" lineClamp={1}>
              Administrator
            </Text>
          </Stack>
        </Flex>
      </Box>
    </Box>
  );
}
