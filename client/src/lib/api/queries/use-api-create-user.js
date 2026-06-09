import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@lib/api/client";
import { routes } from "@lib/api/routes";
import { userKeys } from "@lib/api/queries/keys";

/**
 * Create a user from `{ name, zipCode }`; the server derives the geo fields.
 * Invalidates the user list on success.
 * @returns {import('@tanstack/react-query').UseMutationResult<import('@lib/api/types').User, Error, import('@lib/api/types').UserInput>}
 */
export function useAPICreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      const { data } = await client.post(routes.users.create(), input);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.all }),
  });
}
