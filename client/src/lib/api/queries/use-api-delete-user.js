import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@lib/api/client";
import { routes } from "@lib/api/routes";
import { userKeys } from "@lib/api/queries/keys";

/**
 * Delete a user by id. Invalidates the user list on success.
 * @returns {import('@tanstack/react-query').UseMutationResult<void, Error, string>}
 */
export function useAPIDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await client.delete(routes.users.remove(id));
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.all }),
  });
}
