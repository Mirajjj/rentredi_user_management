import {
  AddUserModal,
  UserDrawer,
  UserList,
  UsersContextProvider,
} from "@modules/users";

/**
 * User-management page: wraps the list, the add modal, and the detail drawer in
 * the users context, which owns the feature's shared state (search, layout,
 * selection, the modal) and the create/save/delete actions. The components read
 * that context directly, so the page does no prop-wiring.
 * @returns {JSX.Element}
 */
export function UsersPage() {
  return (
    <UsersContextProvider>
      <UserList />
      <AddUserModal />
      <UserDrawer />
    </UsersContextProvider>
  );
}
