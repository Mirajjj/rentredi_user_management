import { useMemo } from "react";
import { Box, Flex } from "@chakra-ui/react";

import { EmptyState } from "@base/index";
import { useAPIUsers } from "@lib/api/queries/use-api-users";
import { ListEmpty } from "@modules/users/ListEmpty";
import { UserCards } from "@modules/users/UserCards";
import { UsersHeader } from "@modules/users/UsersHeader";
import { UserTable } from "@modules/users/UserTable";
import { cityState, tzChip } from "@modules/users/format";

export { AddUserModal } from "@modules/users/AddUserModal";
export { UserDrawer } from "@modules/users/UserDrawer";

/**
 * @typedef {import('@lib/api/types').User} User
 */

/**
 * Case-insensitive substring filter over the fields a user would search by.
 * @param {User[]} users
 * @param {string} query
 * @returns {User[]}
 */
function filterUsers(users, query) {
  const q = query.trim().toLowerCase();
  if (!q) return users;
  return users.filter((u) =>
    [u.name, u.city, u.state, u.zipCode, cityState(u), tzChip(u.timezone)]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(q))
  );
}

/**
 * The users module's main component: header + the list region, which switches
 * between table, cards, the rich empty state, and the no-results state.
 * Owns the read query and the search filter; selection/layout live in the page.
 * @param {object} props
 * @param {string} props.query
 * @param {(value: string) => void} props.onQuery
 * @param {'table' | 'cards'} props.layout
 * @param {(layout: string) => void} props.onLayout
 * @param {() => void} props.onAdd
 * @param {(user: User) => void} props.onSelect
 * @param {string} [props.selectedId]
 * @returns {JSX.Element}
 */
export const UserList = ({
  query,
  onQuery,
  layout,
  onLayout,
  onAdd,
  onSelect,
  selectedId,
}) => {
  const { data: users, isPending, isError, error } = useAPIUsers();

  const filtered = useMemo(() => filterUsers(users ?? [], query), [users, query]);
  const cities = useMemo(
    () => new Set((users ?? []).map((u) => `${u.city}${u.state}`)).size,
    [users]
  );

  if (isPending)
    return (
      <Flex flex="1" align="center" justify="center">
        <EmptyState loading message="Loading users…" />
      </Flex>
    );

  if (isError)
    return (
      <Flex flex="1" align="center" justify="center">
        <EmptyState tone="error" message={error.message || "Failed to load users."} />
      </Flex>
    );

  return (
    <Flex direction="column" flex="1" minW="0" height="100%">
      <UsersHeader
        count={users.length}
        cities={cities}
        query={query}
        onQuery={onQuery}
        onAdd={onAdd}
        layout={layout}
        onLayout={onLayout}
      />
      <Box flex="1" overflow="auto" bg={layout === "cards" ? "bg.canvas" : "bg.panel"}>
        {users.length === 0 ? (
          <ListEmpty kind="empty" onAdd={onAdd} />
        ) : filtered.length === 0 ? (
          <ListEmpty kind="no-results" query={query} onClear={() => onQuery("")} />
        ) : layout === "table" ? (
          <UserTable users={filtered} onSelect={onSelect} selectedId={selectedId} />
        ) : (
          <UserCards users={filtered} onSelect={onSelect} selectedId={selectedId} />
        )}
      </Box>
    </Flex>
  );
};
