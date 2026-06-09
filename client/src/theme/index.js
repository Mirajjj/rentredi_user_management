import { createSystem, defaultConfig } from "@chakra-ui/react";

import { customConfig } from "@theme/tokens";

// Chakra v3: layer our brand config on top of the default config. The resulting
// system is handed to <ChakraProvider value={system}> in main.jsx.
export const system = createSystem(defaultConfig, customConfig);
