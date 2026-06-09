import { SegmentGroup } from "@chakra-ui/react";

/**
 * @typedef {object} Segment
 * @property {string} value
 * @property {React.ReactNode} label
 */

/**
 * A compact two-or-more option segmented control (Chakra v3 SegmentGroup).
 * @param {object} props
 * @param {Segment[]} props.options
 * @param {string} props.value         currently selected option value
 * @param {(value: string) => void} props.onChange
 * @param {string} [props.ariaLabel]
 * @returns {JSX.Element}
 */
export function SegmentedToggle({ options, value, onChange, ariaLabel }) {
  return (
    <SegmentGroup.Root
      value={value}
      onValueChange={(e) => e.value && onChange(e.value)}
      size="sm"
      aria-label={ariaLabel}
      bg="bg.panel"
      borderWidth="1px"
      borderColor="border.strong"
      borderRadius="7px"
      boxShadow="xs"
    >
      <SegmentGroup.Indicator bg="brand.subtle" borderRadius="5px" />
      {options.map((opt) => (
        <SegmentGroup.Item
          key={opt.value}
          value={opt.value}
          fontSize="13px"
          fontWeight="600"
          color={value === opt.value ? "brand.fg" : "fg.subtle"}
          style={{ cursor: value !== opt.value ? "pointer" : "default" }}
        >
          <SegmentGroup.ItemText>{opt.label}</SegmentGroup.ItemText>
          <SegmentGroup.ItemHiddenInput />
        </SegmentGroup.Item>
      ))}
    </SegmentGroup.Root>
  );
}
