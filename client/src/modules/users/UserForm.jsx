import { useState } from "react";
import { Button, Group, Input, Stack, Text } from "@chakra-ui/react";

import { Field } from "@base/index";
import { validateUser } from "@modules/users/validate";

/**
 * Create/edit form for a user (`name`, `zipCode`). Passing `user` switches it to
 * edit mode (pre-filled, shows Cancel). Server validation errors surface at the
 * top; client errors surface per-field.
 *
 * @param {object} props
 * @param {import('@lib/api/types').User} [props.user] present → edit mode
 * @param {(fields: import('@lib/api/types').UserInput) => void} props.onSubmit
 * @param {() => void} [props.onCancel] shown in edit mode
 * @param {boolean} [props.pending]
 * @param {Error & { details?: unknown }} [props.error] server error
 * @returns {JSX.Element}
 */
export function UserForm({ user, onSubmit, onCancel, pending, error }) {
  const isEdit = Boolean(user);
  const [name, setName] = useState(user?.name ?? "");
  const [zipCode, setZipCode] = useState(user?.zipCode ?? "");
  const [errors, setErrors] = useState({});

  /** @param {React.FormEvent} event */
  const handleSubmit = (event) => {
    event.preventDefault();
    const found = validateUser({ name, zipCode });
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    onSubmit({ name: name.trim(), zipCode: zipCode.trim() });
    if (!isEdit) {
      setName("");
      setZipCode("");
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Stack gap={4}>
        {error && (
          <Text color="red.600" fontSize="sm">
            {error.message}
          </Text>
        )}
        <Field label="Name" required error={errors.name}>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ada Lovelace"
          />
        </Field>
        <Field
          label="Zip code"
          required
          error={errors.zipCode}
          helperText="5-digit US zip — we derive location and timezone from it."
        >
          <Input
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            placeholder="10001"
            inputMode="numeric"
            maxLength={5}
          />
        </Field>
        <Group>
          <Button type="submit" colorPalette="brand" loading={pending}>
            {isEdit ? "Save changes" : "Add user"}
          </Button>
          {isEdit && onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </Group>
      </Stack>
    </form>
  );
}
