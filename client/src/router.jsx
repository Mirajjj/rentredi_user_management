import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Flex, Spinner } from "@chakra-ui/react";

// Page modules are code-split: each is its own lazy chunk, fetched on first
// navigation instead of riding in the entry bundle. Our components use named
// exports, so we adapt them to React.lazy's default-export contract here.
const UsersPage = lazy(() =>
  import("@pages/UsersPage").then((m) => ({ default: m.UsersPage })),
);

/**
 * Application routes. The shell (sidebar + toast portal) stays mounted; only
 * this main-area content swaps per route, suspended on its lazy chunk. `/users`
 * is the single feature page today; `/` and unknown paths redirect to it.
 * @returns {JSX.Element}
 */
export function AppRoutes() {
  return (
    <Suspense
      fallback={
        <Flex flex="1" align="center" justify="center">
          <Spinner color="brand.solid" />
        </Flex>
      }
    >
      <Routes>
        <Route path="/users" element={<UsersPage />} />
        <Route path="*" element={<Navigate to="/users" replace />} />
      </Routes>
    </Suspense>
  );
}
