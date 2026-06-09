import { Box, Flex } from "@chakra-ui/react";

import { EmptyState } from "@base/index";
import { ListEmpty } from "@modules/users/ListEmpty";
import { UserCards } from "@modules/users/UserCards";
import { UsersHeader } from "@modules/users/UsersHeader";
import { UserTable } from "@modules/users/UserTable";
import { useUsersContext } from "@modules/users/context";

export { UsersContextProvider } from "@modules/users/context";
export { AddUserModal } from "@modules/users/modals/AddUserModal";
export { UserDrawer } from "@modules/users/UserDrawer";

/**
 * The users module's main component: header + the list region, which switches
 * between table, cards, the rich empty state, and the no-results state. Reads
 * the list, layout, and load status from the users context; the child
 * components read what they need from the same context.
 * @returns {JSX.Element}
 */
export const UserList = () => {
  const { users, filtered, areaLayout, isPending, isError, error } =
    useUsersContext();

  if (isPending)
    return (
      <Flex flex="1" align="center" justify="center">
        <EmptyState loading message="Loading users…" />
      </Flex>
    );

  if (isError)
    return (
      <Flex flex="1" align="center" justify="center">
        <EmptyState tone="error" message={error?.message || "Failed to load users."} />
      </Flex>
    );

  return (
    <Flex direction="column" flex="1" minW="0" height="100%">
      <UsersHeader />
      <Box
        flex="1"
        overflow="auto"
        bg={areaLayout === "cards" ? "bg.canvas" : "bg.panel"}
      >
        {users.length === 0 ? (
          <ListEmpty kind="empty" />
        ) : filtered.length === 0 ? (
          <ListEmpty kind="no-results" />
        ) : areaLayout === "table" ? (
          <UserTable />
        ) : (
          <UserCards />
        )}
      </Box>
    </Flex>
  );
};
