import axios from "axios";

// Single configured Axios instance. `baseURL` comes from the build-time env
// (`client/.env` locally, platform env in CodeSandbox).
export const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Surface the server's error body (`{ error, details }`) as the thrown error so
// callers — and React Query — see a meaningful message instead of "Request
// failed with status code 400".
client.interceptors.response.use(
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
