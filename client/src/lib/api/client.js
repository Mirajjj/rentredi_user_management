import axios from "axios";

/**
 * Create and configure the Axios instance the API client runs on. Kept separate
 * from the endpoint definitions (the reference's split between instance creation
 * and `requests(client)`) so the same endpoints can be bound to a different
 * instance — e.g. a mock in a future test.
 * @returns {import('axios').AxiosInstance}
 */
export const createHttp = () => {
  // Default to the relative `/api` path, which the Vite dev server proxies to
  // the API (see vite.config.js) — same-origin, so no CORS or cross-subdomain
  // URL. `VITE_API_URL` stays an optional override (e.g. to hit a remote API).
  const http = axios.create({ baseURL: import.meta.env.VITE_API_URL ?? "/api" });

  // Surface the server's error body ({ error, details }) as the thrown error so
  // callers — and React Query — see a meaningful message instead of "Request
  // failed with status code 400".
  http.interceptors.response.use(
    (response) => response,
    (error) => {
      const data = error.response?.data;
      if (data?.error) {
        const wrapped = new Error(data.error);
        wrapped.status = error.response.status;
        wrapped.details = data.details;
        return Promise.reject(wrapped);
      }
      return Promise.reject(error);
    }
  );

  return http;
};
