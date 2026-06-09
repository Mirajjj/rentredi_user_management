import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@lib/api";
import { userKeys } from "@lib/api/queries/keys";

/**
 * Delete a user by id. Invalidates the user list on success.
 * @returns {import('@tanstack/react-query').UseMutationResult<void, Error, string>}
 */
export function useAPIDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.deleteUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.all }),
  });
}
