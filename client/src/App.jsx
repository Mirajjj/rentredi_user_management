import { Flex } from "@chakra-ui/react";

import { AppToaster, Sidebar } from "@base/index";
import { AppRoutes } from "@/router";

/**
 * App shell: a fixed sidebar beside the routed, code-split main area, with the
 * toast portal mounted once at the root.
 * @returns {JSX.Element}
 */
export function App() {
  return (
    <>
      <Flex height="100%" bg="bg.canvas">
        <Sidebar />
        <AppRoutes />
      </Flex>
      <AppToaster />
    </>
  );
}
