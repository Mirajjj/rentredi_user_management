import { useId } from "react";
import { Box, Text } from "@chakra-ui/react";

/**
 * Stylized (non-real) map: an SVG graticule with a soft glow and a glowing dot
 * placed by projecting lon/lat onto a CONUS-ish box. Decorative — it conveys
 * "this user sits at these coordinates", not a literal location.
 * @param {object} props
 * @param {number} props.lat
 * @param {number} props.lon
 * @param {string} [props.label] caption pill, e.g. `"Denver, CO"`
 * @returns {JSX.Element}
 */
export function GeoMap({ lat, lon, label }) {
  const glowId = useId();
  const px = Math.max(6, Math.min(94, ((lon + 125) / 59) * 100));
  const py = Math.max(8, Math.min(92, ((50 - lat) / 26) * 100));

  return (
    <Box
      position="relative"
      width="100%"
      height="168px"
      borderRadius="10px"
      overflow="hidden"
      borderWidth="1px"
      borderColor="border.subtle"
      backgroundImage="linear-gradient(160deg, #f7f8fb 0%, #eef0f6 100%)"
    >
      <svg
        viewBox="0 0 100 60"
        preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <defs>
          <radialGradient id={glowId} cx="50%" cy="50%">
            <stop offset="0%" stopColor="#635BFF" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#635BFF" stopOpacity="0" />
          </radialGradient>
        </defs>
        {Array.from({ length: 11 }).map((_, i) => (
          <line
            key={`v${i}`}
            x1={i * 10}
            y1="0"
            x2={i * 10}
            y2="60"
            stroke="#d3d8e4"
            strokeWidth="0.3"
          />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <line
            key={`h${i}`}
            x1="0"
            y1={i * 10}
            x2="100"
            y2={i * 10}
            stroke="#d3d8e4"
            strokeWidth="0.3"
          />
        ))}
        <path
          d="M-5 38 Q30 20 60 34 T108 26"
          fill="none"
          stroke="#c7cee0"
          strokeWidth="0.4"
          opacity="0.8"
        />
        <path
          d="M-5 50 Q35 36 70 46 T108 40"
          fill="none"
          stroke="#c7cee0"
          strokeWidth="0.4"
          opacity="0.6"
        />
        <circle cx={px} cy={py * 0.6} r="14" fill={`url(#${glowId})`} />
      </svg>

      <Box
        position="absolute"
        left={`${px}%`}
        top={`${py}%`}
        transform="translate(-50%,-50%)"
      >
        <Box
          position="absolute"
          inset="-9px"
          borderRadius="full"
          borderWidth="1.5px"
          borderColor="brand.solid"
          opacity={0.4}
        />
        <Box
          boxSize="12px"
          borderRadius="full"
          bg="brand.solid"
          border="2.5px solid #fff"
          boxShadow="0 1px 4px rgba(99,91,255,.5)"
        />
      </Box>

      {label && (
        <Text
          position="absolute"
          left="12px"
          bottom="10px"
          bg="rgba(255,255,255,.9)"
          backdropFilter="blur(6px)"
          borderWidth="1px"
          borderColor="border.subtle"
          borderRadius="6px"
          px="2.5"
          py="1"
          fontSize="xs"
          fontWeight="600"
          letterSpacing="-0.01em"
          whiteSpace="nowrap"
        >
          {label}
        </Text>
      )}
    </Box>
  );
}
