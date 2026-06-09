import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react";
import App from "./App.jsx";

// Chakra UI v3: build a system from the default config and pass it to the
// provider via `value`. (This is not the v2 `theme={...}` API.)
const system = createSystem(defaultConfig);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider value={system}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
