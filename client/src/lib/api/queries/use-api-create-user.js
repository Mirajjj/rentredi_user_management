import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@lib/api";
import { userKeys } from "@lib/api/queries/keys";

/**
 * Create a user from `{ name, zipCode }`; the server derives the geo fields.
 * Invalidates the user list on success.
 * @returns {import('@tanstack/react-query').UseMutationResult<import('@lib/api/types').User, Error, import('@lib/api/types').UserInput>}
 */
export function useAPICreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input) => api.createUser(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.all }),
  });
}
