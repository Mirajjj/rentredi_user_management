import { Flex, Text } from "@chakra-ui/react";

/**
 * A label/value row in the drawer's read-only "enriched from zip" section.
 * @param {object} props
 * @param {string} props.label
 * @param {React.ReactNode} props.children
 * @param {boolean} [props.mono]
 * @returns {JSX.Element}
 */
export function DataRow({ label, children, mono }) {
  return (
    <Flex
      align="center"
      justify="space-between"
      py="2.5"
      borderBottomWidth="1px"
      borderColor="border.subtle"
    >
      <Text
        fontSize="12.5px"
        color="fg.subtle"
        fontWeight="600"
        textTransform="uppercase"
        letterSpacing="0.04em"
      >
        {label}
      </Text>
      <Text
        fontFamily={mono ? "mono" : undefined}
        fontSize="13.5px"
        fontWeight={mono ? "500" : "600"}
        textAlign="right"
      >
        {children}
      </Text>
    </Flex>
  );
}
