// Single source of URL truth for the API. Path builders only — the Axios
// instance in `client.js` supplies the base URL and HTTP verbs.
export const routes = {
  users: {
    list: () => "/users",
    byId: (id) => `/users/${id}`,
    create: () => "/users",
    update: (id) => `/users/${id}`,
    remove: (id) => `/users/${id}`,
  },
};
