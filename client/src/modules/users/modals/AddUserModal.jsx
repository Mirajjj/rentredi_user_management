import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  CloseButton,
  Dialog,
  Flex,
  Grid,
  Heading,
  Input,
  InputGroup,
  Portal,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { AlertCircle, CheckCircle2, Globe, MapPin } from "lucide-react";

import { Avatar, toaster } from "@base/index";
import { ZIP_FORMAT } from "@modules/users/constants";
import { useUsersContext } from "@modules/users/context";
import { cityState, tzFull } from "@/modules/users/utils";

/**
 * @typedef {import('@lib/api/types').User} User
 */

/**
 * Create-user dialog driving its own phases off the create mutation:
 * `form → loading → success`, with a `form ↔ error` branch. Zip *format* is
 * validated live (5 digits); the real city/state/lat/lon/tz resolve on submit.
 * A 400 (bad zip) returns to the form with a field error; a 5xx/network failure
 * shows the error phase with "Try again".
 * @returns {JSX.Element}
 */
export function AddUserModal() {
  const { modalOpen, closeModal, createUser } = useUsersContext();
  const [phase, setPhase] = useState(/** @type {'form'|'loading'|'success'|'error'} */ ("form"));
  const [name, setName] = useState("");
  const [zip, setZip] = useState("");
  const [touched, setTouched] = useState(false);
  const [zipError, setZipError] = useState("");
  const [created, setCreated] = useState(/** @type {User | null} */ (null));
  const nameRef = useRef(/** @type {HTMLInputElement | null} */ (null));

  useEffect(() => {
    if (!modalOpen) {
      setPhase("form");
      setName("");
      setZip("");
      setTouched(false);
      setZipError("");
      setCreated(null);
    }
  }, [modalOpen]);

  function close() {
    if (phase === "error") {
      toaster.create({
        type: "error",
        title: "Couldn’t add user",
        description:
          "The geo enrichment service was unavailable. Please try again.",
        duration: 9000,
      });
    }
    closeModal();
  }

  const nameInvalid = touched && name.trim().length <= 1;
  const zipFormatOk = ZIP_FORMAT.test(zip);
  const canSubmit = name.trim().length > 1 && zipFormatOk;

  async function submit() {
    if (!canSubmit) {
      setTouched(true);
      return;
    }
    setZipError("");
    setPhase("loading");
    try {
      const user = await createUser({ name: name.trim(), zipCode: zip });
      setCreated(user);
      setPhase("success");
    } catch (err) {
      if (err?.status === 400) {
        setZipError(err.message || "Couldn’t find that zip code.");
        setPhase("form");
      } else {
        setPhase("error");
      }
    }
  }

  return (
    <Dialog.Root
      open={modalOpen}
      onOpenChange={(e) => !e.open && close()}
      placement="center"
      initialFocusEl={() => nameRef.current}
    >
      <Portal>
        <Dialog.Backdrop bg="rgba(18,22,45,.42)" backdropFilter="blur(3px)" />
        <Dialog.Positioner>
          <Dialog.Content
            width="460px"
            maxW="calc(100vw - 32px)"
            borderRadius="14px"
            boxShadow="lg"
            overflow="hidden"
          >
            <Flex px="6" pt="5" justify="space-between" align="flex-start">
              <Stack gap="1">
                <Heading size="md" letterSpacing="-0.02em">
                  {phase === "success" ? "User added" : "Add a user"}
                </Heading>
                <Text fontSize="13.5px" color="fg.subtle">
                  {phase === "success"
                    ? "Enriched and saved to your directory."
                    : "Name and zip code — we’ll do the rest."}
                </Text>
              </Stack>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Flex>

            <Box px="6" pt="5" pb="6">
              {phase === "form" && (
                <Stack gap="4">
                  <Stack gap="1.5">
                    <Text fontSize="13px" fontWeight="600">
                      Full name
                    </Text>
                    <Input
                      ref={nameRef}
                      placeholder="e.g. Maya Rodriguez"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && submit()}
                      borderColor={nameInvalid ? "error.solid" : undefined}
                    />
                    {nameInvalid && (
                      <Flex align="center" gap="1.5" color="error.solid" fontSize="12.5px">
                        <AlertCircle size={14} /> Enter the user’s name.
                      </Flex>
                    )}
                  </Stack>

                  <Stack gap="1.5">
                    <Text fontSize="13px" fontWeight="600">
                      Zip code
                    </Text>
                    <InputGroup
                      endElement={
                        zip && !zipFormatOk ? (
                          <Box color="error.solid">
                            <AlertCircle size={17} />
                          </Box>
                        ) : zipFormatOk && !zipError ? (
                          <Box color="success.solid">
                            <CheckCircle2 size={17} />
                          </Box>
                        ) : (
                          <Box color="fg.subtle">
                            <MapPin size={16} />
                          </Box>
                        )
                      }
                    >
                      <Input
                        placeholder="94107"
                        value={zip}
                        inputMode="numeric"
                        maxLength={5}
                        fontFamily="mono"
                        onChange={(e) => {
                          setZip(e.target.value.replace(/[^\d]/g, ""));
                          setZipError("");
                        }}
                        onKeyDown={(e) => e.key === "Enter" && submit()}
                        borderColor={
                          zipError || (zip && !zipFormatOk) ? "error.solid" : undefined
                        }
                      />
                    </InputGroup>
                    {zipError ? (
                      <Flex align="center" gap="1.5" color="error.solid" fontSize="12.5px">
                        <AlertCircle size={14} /> {zipError}
                      </Flex>
                    ) : zip && !zipFormatOk ? (
                      <Flex align="center" gap="1.5" color="error.solid" fontSize="12.5px">
                        <AlertCircle size={14} /> Zip codes are 5 digits.
                      </Flex>
                    ) : (
                      <Text fontSize="12.5px" color="fg.subtle">
                        We’ll resolve city, timezone &amp; coordinates from this.
                      </Text>
                    )}
                  </Stack>
                </Stack>
              )}

              {phase === "loading" && (
                <Stack align="center" textAlign="center" py="6" gap="3">
                  <Box position="relative" boxSize="56px" display="grid" placeItems="center">
                    <Spinner size="xl" color="brand.solid" borderWidth="3px" />
                    <Box position="absolute" color="brand.solid">
                      <Globe size={22} />
                    </Box>
                  </Box>
                  <Text fontSize="15px" fontWeight="600">
                    Looking up location…
                  </Text>
                  <Text fontFamily="mono" fontSize="12.5px" color="fg.subtle">
                    resolving zip {zip} → city · tz · lat/lon
                  </Text>
                </Stack>
              )}

              {phase === "error" && (
                <Stack align="center" textAlign="center" pt="3" gap="0">
                  <Box
                    boxSize="48px"
                    borderRadius="12px"
                    bg="error.subtle"
                    color="error.solid"
                    display="grid"
                    placeItems="center"
                    mb="3.5"
                  >
                    <AlertCircle size={24} strokeWidth={2.2} />
                  </Box>
                  <Text fontSize="15.5px" fontWeight="600">
                    Enrichment service unavailable
                  </Text>
                  <Text
                    fontSize="13.5px"
                    color="fg.muted"
                    maxW="300px"
                    lineHeight="1.5"
                    mt="1.5"
                    mb="4.5"
                  >
                    We couldn’t reach the geo service. Your user wasn’t saved —
                    please try again.
                  </Text>
                  <Flex gap="2.5">
                    <Button variant="outline" onClick={close}>
                      Cancel
                    </Button>
                    <Button colorPalette="brand" onClick={() => setPhase("form")}>
                      Try again
                    </Button>
                  </Flex>
                </Stack>
              )}

              {phase === "success" && created && (
                <Stack gap="4">
                  <Flex
                    align="center"
                    gap="3"
                    px="3.5"
                    py="3"
                    bg="success.subtle"
                    borderRadius="10px"
                  >
                    <Box color="success.solid" flexShrink={0}>
                      <CheckCircle2 size={22} strokeWidth={2.2} />
                    </Box>
                    <Text fontSize="13.5px" color="success.fg" fontWeight="500">
                      Resolved <strong>{created.zipCode}</strong> →{" "}
                      {cityState(created)}.
                    </Text>
                  </Flex>
                  <Flex align="center" gap="3">
                    <Avatar name={created.name} size={40} />
                    <Stack gap="0">
                      <Text fontWeight="600" letterSpacing="-0.01em">
                        {created.name}
                      </Text>
                      <Text fontFamily="mono" fontSize="11.5px" color="fg.subtle">
                        {created.id}
                      </Text>
                    </Stack>
                  </Flex>
                  <Grid
                    borderWidth="1px"
                    borderColor="border.subtle"
                    borderRadius="10px"
                    overflow="hidden"
                  >
                    {[
                      ["City", cityState(created), false],
                      ["Timezone", tzFull(created), true],
                      ["Latitude", created.latitude.toFixed(4), true],
                      ["Longitude", created.longitude.toFixed(4), true],
                    ].map(([k, v, mono], i) => (
                      <Flex
                        key={k.toString()}
                        justify="space-between"
                        align="center"
                        px="3.5"
                        py="2.5"
                        borderTopWidth={i ? "1px" : "0"}
                        borderColor="border.subtle"
                        bg={i % 2 ? "bg.panel" : "bg.subtle"}
                      >
                        <Text
                          fontSize="12.5px"
                          color="fg.subtle"
                          fontWeight="600"
                          textTransform="uppercase"
                          letterSpacing="0.04em"
                        >
                          {k}
                        </Text>
                        <Text
                          fontFamily={mono ? "mono" : undefined}
                          fontSize="13.5px"
                          fontWeight={mono ? "500" : "600"}
                        >
                          {v}
                        </Text>
                      </Flex>
                    ))}
                  </Grid>
                </Stack>
              )}
            </Box>

            {(phase === "form" || phase === "success") && (
              <Flex
                px="6"
                py="4"
                borderTopWidth="1px"
                borderColor="border.subtle"
                bg="bg.subtle"
                justify="flex-end"
                gap="2.5"
              >
                {phase === "form" ? (
                  <>
                    <Button variant="outline" onClick={close}>
                      Cancel
                    </Button>
                    <Button colorPalette="brand" disabled={!canSubmit} onClick={submit}>
                      Look up &amp; add
                    </Button>
                  </>
                ) : (
                  <Button
                    colorPalette="brand"
                    minW="90px"
                    onClick={close}
                  >
                    Done
                  </Button>
                )}
              </Flex>
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
