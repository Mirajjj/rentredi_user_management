import { Grid } from "@chakra-ui/react";

import { UserCard } from "@modules/users/UserCards/UserCard";
import { useUsersContext } from "@modules/users/context";

/**
 * Responsive grid of user cards.
 * @returns {JSX.Element}
 */
export function UserCards() {
  const { filtered } = useUsersContext();

  return (
    <Grid
      p="6"
      gap="4"
      templateColumns="repeat(auto-fill, minmax(280px, 1fr))"
    >
      {filtered.map((u) => (
        <UserCard key={u.id} user={u} />
      ))}
    </Grid>
  );
}
