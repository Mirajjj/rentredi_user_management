import { Grid } from "@chakra-ui/react";

import { UserCard } from "@modules/users/UserCard";

/**
 * @typedef {import('@lib/api/types').User} User
 */

/**
 * Responsive grid of user cards.
 * @param {object} props
 * @param {User[]} props.users
 * @param {(user: User) => void} props.onSelect
 * @param {string} [props.selectedId]
 * @returns {JSX.Element}
 */
export function UserCards({ users, onSelect, selectedId }) {
  return (
    <Grid
      p="6"
      gap="4"
      templateColumns="repeat(auto-fill, minmax(280px, 1fr))"
    >
      {users.map((u) => (
        <UserCard
          key={u.id}
          user={u}
          onSelect={onSelect}
          selected={u.id === selectedId}
        />
      ))}
    </Grid>
  );
}
