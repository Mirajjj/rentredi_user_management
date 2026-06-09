import { Flex } from "@chakra-ui/react";

import { AppToaster, Sidebar } from "@base/index";
import { UsersPage } from "@pages/UsersPage";

/**
 * App shell: a fixed sidebar beside the user-management page, with the toast
 * portal mounted once at the root.
 * @returns {JSX.Element}
 */
export function App() {
  return (
    <>
      <Flex height="100%" bg="bg.canvas">
        <Sidebar />
        <UsersPage />
      </Flex>
      <AppToaster />
    </>
  );
}
