import { routes } from "@lib/api/routes";

/**
 * @typedef {import('@lib/api/types').User} User
 * @typedef {import('@lib/api/types').UserInput} UserInput
 */

/**
 * User endpoints bound to an HTTP instance — one method per route, each
 * returning the response body. This is the unit you split per resource: add
 * `endpoints/<name>.js` with its own factory and spread it into `ClientAPI`.
 * @param {import('axios').AxiosInstance} http
 */
export const usersEndpoints = (http) => ({
  /** @returns {Promise<User[]>} */
  getUsers: async () => {
    const { data } = await http.get(routes.users.list());
    return data;
  },

  /**
   * @param {string} id
   * @returns {Promise<User>}
   */
  getUser: async (id) => {
    const { data } = await http.get(routes.users.byId(id));
    return data;
  },

  /**
   * @param {UserInput} input
   * @returns {Promise<User>}
   */
  createUser: async (input) => {
    const { data } = await http.post(routes.users.create(), input);
    return data;
  },

  /**
   * @param {string} id
   * @param {Partial<UserInput>} fields
   * @returns {Promise<User>}
   */
  updateUser: async (id, fields) => {
    const { data } = await http.put(routes.users.update(id), fields);
    return data;
  },

  /**
   * @param {string} id
   * @returns {Promise<void>}
   */
  deleteUser: async (id) => {
    await http.delete(routes.users.remove(id));
  },
});
