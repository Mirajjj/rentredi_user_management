import { Badge, Button, Card, Group, HStack, Stack, Text } from "@chakra-ui/react";

import { ConfirmButton } from "@base/index";
import { formatTimezone } from "@modules/users/format";

/**
 * One user: name, zip, derived coordinates and timezone, plus edit/delete.
 *
 * @param {object} props
 * @param {import('@lib/api/types').User} props.user
 * @param {(user: import('@lib/api/types').User) => void} props.onEdit
 * @param {(id: string) => void} props.onDelete
 * @param {boolean} [props.deleting]
 * @returns {JSX.Element}
 */
export function UserCard({ user, onEdit, onDelete, deleting }) {
  return (
    <Card.Root>
      <Card.Body>
        <Stack gap={2}>
          <HStack justify="space-between">
            <Text fontWeight="semibold" fontSize="lg">
              {user.name}
            </Text>
            <Badge colorPalette="brand">{user.zipCode}</Badge>
          </HStack>
          <Text color="fg.muted" fontSize="sm">
            {user.latitude.toFixed(4)}, {user.longitude.toFixed(4)} ·{" "}
            {formatTimezone(user.timezone)}
          </Text>
        </Stack>
      </Card.Body>
      <Card.Footer>
        <Group>
          <Button size="sm" variant="outline" onClick={() => onEdit(user)}>
            Edit
          </Button>
          <ConfirmButton
            onConfirm={() => onDelete(user.id)}
            loading={deleting}
            title={`Delete ${user.name}?`}
            description="This permanently removes the user."
            confirmLabel="Delete"
          >
            Delete
          </ConfirmButton>
        </Group>
      </Card.Footer>
    </Card.Root>
  );
}
