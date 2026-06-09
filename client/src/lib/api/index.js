import { createHttp } from "@lib/api/client";
import { usersEndpoints } from "@lib/api/endpoints/users";

/**
 * Build the API client: compose every endpoint group over a single HTTP
 * instance, mirroring the reference's `requests(client)`. Add a resource by
 * writing `endpoints/<name>.js` and spreading its factory here — no call site
 * changes. A plain function returning a plain object (no class, no `this`), so
 * methods stay trivial to move into their own files.
 * @param {import('axios').AxiosInstance} [http]
 */
export const ClientAPI = (http = createHttp()) => ({
  ...usersEndpoints(http),
});

/** Shared instance used across the app (and by the query hooks). */
export const api = ClientAPI();
