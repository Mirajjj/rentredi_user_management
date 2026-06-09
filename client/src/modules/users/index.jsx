import { Stack } from "@chakra-ui/react";

import { EmptyState } from "@base/index";
import { useAPIUsers } from "@lib/api/queries/use-api-users";
import { useAPIDeleteUser } from "@lib/api/queries/use-api-delete-user";
import { UserCard } from "@modules/users/UserCard";

export { UserForm } from "@modules/users/UserForm";

/**
 * The users module's main component: the list. Owns the read query and the
 * delete mutation; renders the loading / empty / error branches via EmptyState.
 *
 * @param {object} props
 * @param {(user: import('@lib/api/types').User) => void} props.onEdit
 * @returns {JSX.Element}
 */
export const UserList = ({ onEdit }) => {
  const { data: users, isPending, isError, error } = useAPIUsers();
  const deleteUser = useAPIDeleteUser();

  if (isPending) return <EmptyState loading message="Loading users…" />;
  if (isError)
    return (
      <EmptyState tone="error" message={error.message || "Failed to load users."} />
    );
  if (users.length === 0)
    return <EmptyState message="No users yet. Add one above to get started." />;

  return (
    <Stack gap={4}>
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          onEdit={onEdit}
          onDelete={(id) => deleteUser.mutate(id)}
          deleting={deleteUser.isPending && deleteUser.variables === user.id}
        />
      ))}
    </Stack>
  );
};
