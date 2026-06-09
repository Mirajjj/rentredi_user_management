import { Box, Text } from "@chakra-ui/react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

import usStates from "@/assets/us-states-10m.json";

/**
 * Real US map (Albers USA projection) with a pin at the user's coordinates.
 * The geography is vendored locally (`@/assets`), so there's no runtime fetch.
 * Albers USA draws the lower 48 plus Alaska/Hawaii insets, so the pin lands
 * correctly for any US zip.
 * @param {object} props
 * @param {number} props.lat
 * @param {number} props.lon
 * @param {string} [props.label] caption pill, e.g. `"Denver, CO"`
 * @returns {JSX.Element}
 */
export function GeoMap({ lat, lon, label }) {
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
      <ComposableMap
        projection="geoAlbersUsa"
        width={800}
        height={500}
        projectionConfig={{ scale: 1000 }}
        preserveAspectRatio="xMidYMid meet"
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={usStates}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#e7eaf3"
                stroke="#cfd5e4"
                strokeWidth={0.5}
                style={{
                  default: { outline: "none" },
                  hover: { fill: "#e7eaf3", outline: "none" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>
        <Marker coordinates={[lon, lat]}>
          <circle r={30} fill="#635BFF" fillOpacity={0.18} />
          <circle r={16} fill="#635BFF" stroke="#fff" strokeWidth={5} />
        </Marker>
      </ComposableMap>

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
