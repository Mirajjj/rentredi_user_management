import { useQuery } from "@tanstack/react-query";

import { client } from "@lib/api/client";
import { routes } from "@lib/api/routes";
import { userKeys } from "@lib/api/queries/keys";

/**
 * Fetch the full user list (sorted by `createdAt` desc, server-side).
 * @returns {import('@tanstack/react-query').UseQueryResult<import('@lib/api/types').User[]>}
 */
export function useAPIUsers() {
  return useQuery({
    queryKey: userKeys.all,
    queryFn: async () => {
      const { data } = await client.get(routes.users.list());
      return data;
    },
  });
}
