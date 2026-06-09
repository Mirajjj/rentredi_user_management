import { Field as ChakraField } from "@chakra-ui/react";

/**
 * Labeled form control with optional error/help text. Wraps Chakra v3's Field
 * namespace so callers just pass a control as children.
 *
 * @param {object} props
 * @param {string} props.label
 * @param {boolean} [props.required]
 * @param {string} [props.error]      shown in red when present (marks invalid)
 * @param {string} [props.helperText] shown when there's no error
 * @param {React.ReactNode} props.children the input control
 * @returns {JSX.Element}
 */
export function Field({ label, required, error, helperText, children }) {
  return (
    <ChakraField.Root required={required} invalid={Boolean(error)}>
      <ChakraField.Label>
        {label}
        {required && <ChakraField.RequiredIndicator />}
      </ChakraField.Label>
      {children}
      {error ? (
        <ChakraField.ErrorText>{error}</ChakraField.ErrorText>
      ) : helperText ? (
        <ChakraField.HelperText>{helperText}</ChakraField.HelperText>
      ) : null}
    </ChakraField.Root>
  );
}
