import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@lib/api/client";
import { routes } from "@lib/api/routes";
import { userKeys } from "@lib/api/queries/keys";

/**
 * Update a user. The server re-derives geo fields only when `zipCode` changes.
 * Invalidates the user list on success.
 * @returns {import('@tanstack/react-query').UseMutationResult<import('@lib/api/types').User, Error, { id: string, fields: Partial<import('@lib/api/types').UserInput> }>}
 */
export function useAPIUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, fields }) => {
      const { data } = await client.put(routes.users.update(id), fields);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.all }),
  });
}
