import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@lib/api";
import { userKeys } from "@lib/api/queries/keys";

/**
 * Update a user. The server re-derives geo fields only when `zipCode` changes.
 * Invalidates the user list on success.
 * @returns {import('@tanstack/react-query').UseMutationResult<import('@lib/api/types').User, Error, { id: string, fields: Partial<import('@lib/api/types').UserInput> }>}
 */
export function useAPIUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, fields }) => api.updateUser(id, fields),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.all }),
  });
}
