import { Box, Flex, Text } from "@chakra-ui/react";

/**
 * Brand mark: a blurple gradient tile with a globe glyph, plus the
 * "User Management" wordmark.
 * @param {object} props
 * @param {number} [props.size=26] tile edge length in px
 * @param {boolean} [props.withWordmark=true]
 * @returns {JSX.Element}
 */
export function Logo({ size = 26, withWordmark = true }) {
  return (
    <Flex align="center" gap="2.5">
      <Box
        position="relative"
        boxSize={`${size}px`}
        borderRadius="8px"
        flexShrink={0}
        display="grid"
        placeItems="center"
        backgroundImage="linear-gradient(135deg, #635BFF 0%, #ec4899 120%)"
        boxShadow="0 1px 2px rgba(16,24,64,.18), inset 0 1px 0 rgba(255,255,255,.25)"
      >
        <svg
          width={size * 0.62}
          height={size * 0.62}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="8.4" opacity="0.92" />
          <path d="M3.6 12h16.8" opacity="0.92" />
          <path
            d="M12 3.6c2.3 2.2 3.5 5.2 3.5 8.4S14.3 18.2 12 20.4c-2.3-2.2-3.5-5.2-3.5-8.4S9.7 5.8 12 3.6Z"
            opacity="0.92"
          />
          <circle cx="15.4" cy="8.2" r="1.5" fill="#fff" stroke="none" />
        </svg>
      </Box>
      {withWordmark && (
        <Text
          fontSize={`${Math.round(size * 0.58)}px`}
          fontWeight="700"
          letterSpacing="-0.03em"
          whiteSpace="nowrap"
        >
          User Management
        </Text>
      )}
    </Flex>
  );
}
