import { createContext, useContext, useMemo, useState } from "react";

import { toaster } from "@base/index";
import { useAPIUsers } from "@lib/api/queries/use-api-users";
import { useAPICreateUser } from "@lib/api/queries/use-api-create-user";
import { useAPIUpdateUser } from "@lib/api/queries/use-api-update-user";
import { useAPIDeleteUser } from "@lib/api/queries/use-api-delete-user";
import { cityState } from "@/modules/users/utils";
import { filterUsers } from "@modules/users/context/utils";

/**
 * @typedef {import('@lib/api/types').User} User
 * @typedef {import('@lib/api/types').UserInput} UserInput
 * @typedef {import('@modules/users/context/types').UsersContextValue} UsersContextValue
 */

/** @type {import('react').Context<UsersContextValue | null>} */
const UsersContext = createContext(null);

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
