import { Box, Text } from "@chakra-ui/react";

/**
 * A labelled value cell used in the user card's stat grid.
 * @param {object} props
 * @param {string} props.label
 * @param {string} props.value
 * @returns {JSX.Element}
 */
export function Stat({ label, value }) {
  return (
    <Box bg="bg.subtle" px="2.5" py="2">
      <Text
        fontSize="10.5px"
        textTransform="uppercase"
        letterSpacing="0.05em"
        color="fg.subtle"
        fontWeight="600"
      >
        {label}
      </Text>
      <Text fontFamily="mono" fontSize="12.5px" color="fg" mt="0.5">
        {value}
      </Text>
    </Box>
  );
}
