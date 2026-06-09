import { Box } from "@chakra-ui/react";

/**
 * Derive up-to-two initials and a deterministic hue from a name.
 * @param {string} name
 * @returns {{ initials: string, hue: number }}
 */
function fromName(name) {
  const safe = name || "?";
  const initials = safe
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  let hue = 0;
  for (let i = 0; i < safe.length; i++) {
    hue = (hue * 31 + safe.charCodeAt(i)) % 360;
  }
  return { initials, hue };
}

/**
 * Circular initials avatar with a deterministic two-stop hue gradient.
 * @param {object} props
 * @param {string} props.name
 * @param {number} [props.size=32] diameter in px
 * @returns {JSX.Element}
 */
export function Avatar({ name, size = 32 }) {
  const { initials, hue } = fromName(name);
  return (
    <Box
      boxSize={`${size}px`}
      borderRadius="full"
      flexShrink={0}
      display="grid"
      placeItems="center"
      color="white"
      fontWeight="600"
      letterSpacing="-0.02em"
      fontSize={`${Math.round(size * 0.4)}px`}
      backgroundImage={`linear-gradient(135deg, hsl(${hue} 62% 60%), hsl(${(hue + 40) % 360} 64% 52%))`}
      boxShadow="inset 0 1px 0 rgba(255,255,255,.3)"
    >
      {initials}
    </Box>
  );
}
