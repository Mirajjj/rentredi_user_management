import { useState } from "react";

import { toaster } from "@base/index";
import { AddUserModal, UserDrawer, UserList } from "@modules/users";
import { cityState } from "@modules/users/format";

/**
 * @typedef {import('@lib/api/types').User} User
 */

/**
 * User-management page: the container. Owns the search query, list layout, the
 * selected user (drawer), and the add-modal open state; composes the list with
 * the create modal and the detail drawer, and fires toasts on mutation outcomes.
 * Server state stays in the TanStack Query hooks inside the users module.
 * @returns {JSX.Element}
 */
export function UsersPage() {
  const [query, setQuery] = useState("");
  const [layout, setLayout] = useState(/** @type {'table' | 'cards'} */ ("table"));
  const [selected, setSelected] = useState(/** @type {User | null} */ (null));
  const [modalOpen, setModalOpen] = useState(false);

  /** @param {User} user */
  const handleCreated = (user) => {
    toaster.create({
      type: "success",
      title: "User added",
      description: `${user.name} · ${cityState(user)}`,
    });
  };

  /** @param {User} user */
  const handleSaved = (user) => {
    setSelected(user);
    toaster.create({
      type: "success",
      title: "Changes saved",
      description: `${user.name}’s record was updated.`,
    });
  };

  /** @param {User} user */
  const handleDeleted = (user) => {
    setSelected(null);
    toaster.create({
      type: "info",
      title: "User deleted",
      description: `${user.name} was removed.`,
    });
  };

  return (
    <>
      <UserList
        query={query}
        onQuery={setQuery}
        layout={layout}
        onLayout={(value) => setLayout(/** @type {'table' | 'cards'} */ (value))}
        onAdd={() => setModalOpen(true)}
        onSelect={setSelected}
        selectedId={selected?.id}
      />

      <AddUserModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onCreated={handleCreated}
      />

      <UserDrawer
        user={selected}
        onOpenChange={(open) => !open && setSelected(null)}
        onSaved={handleSaved}
        onDeleted={handleDeleted}
      />
    </>
  );
}
