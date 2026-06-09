import { createContext, useContext, useMemo, useState } from "react";

import { toaster } from "@base/index";
import { useAPIUsers } from "@lib/api/queries/use-api-users";
import { useAPICreateUser } from "@lib/api/queries/use-api-create-user";
import { useAPIUpdateUser } from "@lib/api/queries/use-api-update-user";
import { useAPIDeleteUser } from "@lib/api/queries/use-api-delete-user";
import { cityState, tzChip } from "@modules/users/format";

/**
 * @typedef {import('@lib/api/types').User} User
 * @typedef {import('@lib/api/types').UserInput} UserInput
 */

/**
 * Everything the users feature shares. UI state (search, layout, the selected
 * user, the add-modal) and server state (the list + the create/save/delete
 * actions, which own their toasts and selection side-effects) live here, so the
 * feature's components read what they need instead of receiving it through props.
 * Genuinely local state — a form's draft fields, a dialog's phase — stays in the
 * component that owns it.
 * @typedef {object} UsersContextValue
 * @property {string} searchQuery
 * @property {(value: string) => void} setSearchQuery
 * @property {'table' | 'cards'} areaLayout
 * @property {(layout: 'table' | 'cards') => void} setAreaLayout
 * @property {User[]} users               the full list
 * @property {User[]} filtered            the list after the search filter
 * @property {number} count               total users
 * @property {number} cityCount           distinct city/state pairs
 * @property {boolean} isPending
 * @property {boolean} isError
 * @property {Error | null} error
 * @property {User | null} selected       the user shown in the drawer
 * @property {(user: User) => void} select
 * @property {() => void} clearSelected
 * @property {boolean} modalOpen
 * @property {() => void} openModal
 * @property {() => void} closeModal
 * @property {(input: UserInput) => Promise<User>} createUser   toasts on success; throws on failure
 * @property {boolean} creating
 * @property {(id: string, fields: Partial<UserInput>) => Promise<User>} saveUser   toasts + updates selection; throws on failure
 * @property {boolean} saving
 * @property {(user: User) => Promise<void>} deleteUser   toasts + clears selection; throws on failure
 * @property {boolean} deleting
 */

/** @type {import('react').Context<UsersContextValue | null>} */
const UsersContext = createContext(null);

/**
 * Case-insensitive substring filter over the fields a user would search by.
 * @param {User[]} users
 * @param {string} query
 * @returns {User[]}
 */
function filterUsers(users, query) {
  const q = query.trim().toLowerCase();
  if (!q) return users;
  return users.filter((u) =>
    [u.name, u.city, u.state, u.zipCode, cityState(u), tzChip(u.timezone)]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(q)),
  );
}

/**
 * Provides {@link UsersContextValue} to the users feature. Wrap the page region
 * that renders the list, the add modal, and the detail drawer.
 * @param {{ children: import('react').ReactNode }} props
 * @returns {JSX.Element}
 */
export function UsersContextProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [areaLayout, setAreaLayout] = useState(
    /** @type {'table' | 'cards'} */ ("table"),
  );
  const [selected, setSelected] = useState(/** @type {User | null} */ (null));
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isPending, isError, error } = useAPIUsers();
  const users = data ?? [];

  const createMutation = useAPICreateUser();
  const updateMutation = useAPIUpdateUser();
  const deleteMutation = useAPIDeleteUser();

  const filtered = useMemo(
    () => filterUsers(users, searchQuery),
    [users, searchQuery],
  );
  const cityCount = useMemo(
    () => new Set(users.map((u) => `${u.city}${u.state}`)).size,
    [users],
  );

  /** @param {UserInput} input */
  const createUser = async (input) => {
    const user = await createMutation.mutateAsync(input);
    toaster.create({
      type: "success",
      title: "User added",
      description: `${user.name} · ${cityState(user)}`,
    });
    return user;
  };

  /**
   * @param {string} id
   * @param {Partial<UserInput>} fields
   */
  const saveUser = async (id, fields) => {
    try {
      const user = await updateMutation.mutateAsync({ id, fields });
      setSelected(user);
      toaster.create({
        type: "success",
        title: "Changes saved",
        description: `${user.name}’s record was updated.`,
      });
      return user;
    } catch (err) {
      toaster.create({
        type: "error",
        title: "Couldn’t save changes",
        description: err?.message || "Please try again.",
      });
      throw err;
    }
  };

  /** @param {User} user */
  const deleteUser = async (user) => {
    try {
      await deleteMutation.mutateAsync(user.id);
      setSelected(null);
      toaster.create({
        type: "info",
        title: "User deleted",
        description: `${user.name} was removed.`,
      });
    } catch (err) {
      toaster.create({
        type: "error",
        title: "Couldn’t delete user",
        description: err?.message || "Please try again.",
      });
      throw err;
    }
  };

  /** @type {UsersContextValue} */
  const value = {
    searchQuery,
    setSearchQuery,
    areaLayout,
    setAreaLayout,
    users,
    filtered,
    count: users.length,
    cityCount,
    isPending,
    isError,
    error,
    selected,
    select: setSelected,
    clearSelected: () => setSelected(null),
    modalOpen,
    openModal: () => setModalOpen(true),
    closeModal: () => setModalOpen(false),
    createUser,
    creating: createMutation.isPending,
    saveUser,
    saving: updateMutation.isPending,
    deleteUser,
    deleting: deleteMutation.isPending,
  };

  return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>;
}

/**
 * Read the users feature state. Throws if used outside {@link UsersContextProvider}.
 * @returns {UsersContextValue}
 */
export function useUsersContext() {
  const ctx = useContext(UsersContext);
  if (!ctx) {
    throw new Error("useUsersContext must be used within <UsersContextProvider>");
  }
  return ctx;
}
