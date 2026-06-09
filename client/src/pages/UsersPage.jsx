import { useState } from "react";
import { Card, Heading, Stack } from "@chakra-ui/react";

import { useAPICreateUser } from "@lib/api/queries/use-api-create-user";
import { useAPIUpdateUser } from "@lib/api/queries/use-api-update-user";
import { UserForm, UserList } from "@modules/users";

/**
 * The user-management page: a create/edit form above the list. Owns the
 * "currently editing" UI state and wires the create/update mutations; all
 * server state lives in the query hooks inside the users module.
 * @returns {JSX.Element}
 */
export function UsersPage() {
  const [editing, setEditing] = useState(
    /** @type {import('@lib/api/types').User | null} */ (null)
  );
  const createUser = useAPICreateUser();
  const updateUser = useAPIUpdateUser();

  /** @param {import('@lib/api/types').UserInput} fields */
  const handleSubmit = (fields) => {
    if (editing) {
      updateUser.mutate(
        { id: editing.id, fields },
        { onSuccess: () => setEditing(null) }
      );
    } else {
      createUser.mutate(fields);
    }
  };

  const active = editing ? updateUser : createUser;

  return (
    <Stack gap={8}>
      <Card.Root>
        <Card.Header>
          <Heading size="md">{editing ? "Edit user" : "Add a user"}</Heading>
        </Card.Header>
        <Card.Body>
          <UserForm
            key={editing?.id ?? "create"}
            user={editing ?? undefined}
            onSubmit={handleSubmit}
            onCancel={editing ? () => setEditing(null) : undefined}
            pending={active.isPending}
            error={active.error ?? undefined}
          />
        </Card.Body>
      </Card.Root>

      <UserList onEdit={setEditing} />
    </Stack>
  );
}
