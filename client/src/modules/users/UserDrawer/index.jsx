import { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  CloseButton,
  Drawer,
  Flex,
  Input,
  InputGroup,
  Portal,
  Stack,
  Text,
} from "@chakra-ui/react";
import { AlertCircle, Check, Clock, MapPin, Trash2 } from "lucide-react";

import { Avatar, GeoMap } from "@base/index";
import { ZIP_FORMAT } from "@modules/users/constants";
import { DataRow } from "@modules/users/UserDrawer/DataRow";
import { useUsersContext } from "@modules/users/context";
import { cityState, localTime, tzChip, tzFull } from "@/modules/users/utils";

/**
 * @typedef {import('@lib/api/types').User} User
 */

/**
 * Right slide-in detail/edit pane for one user. Shows the stylized map, local
 * time, editable name/zip, the read-only "enriched from zip" rows, an inline
 * delete confirm, and Save (enabled only when dirty + valid). Server re-derives
 * geo only when the zip changes. Reads the selected user and the save/delete
 * actions from the users context.
 * @returns {JSX.Element}
 */
export function UserDrawer() {
  const { selected, clearSelected, saveUser, saving, deleteUser, deleting } =
    useUsersContext();
  const user = selected;
  const [name, setName] = useState("");
  const [zip, setZip] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setZip(user.zipCode);
      setConfirmDelete(false);
      setJustSaved(false);
    }
  }, [user?.id]);

  const open = Boolean(user);
  const zipValid = ZIP_FORMAT.test(zip);
  const zipChanged = Boolean(user) && zip !== user.zipCode;
  const dirty =
    Boolean(user) && (name.trim() !== user.name || (zipChanged && zipValid));
  const canSave =
    Boolean(user) && name.trim().length > 1 && zipValid && dirty;

  async function save() {
    if (!canSave || !user) return;
    const fields = { name: name.trim(), zipCode: zip };
    try {
      await saveUser(user.id, fields);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 1600);
    } catch {
      // the context action already surfaced the error
    }
  }

  async function remove() {
    if (!user) return;
    try {
      await deleteUser(user);
    } catch {
      // the context action already surfaced the error
    }
  }

  return (
    <Drawer.Root
      open={open}
      onOpenChange={(e) => !e.open && clearSelected()}
      placement="end"
      size="sm"
    >
      <Portal>
        <Drawer.Backdrop bg="rgba(18,22,45,.28)" />
        <Drawer.Positioner>
          <Drawer.Content maxW="460px" boxShadow="pane">
            {user && (
              <>
                <Drawer.Header
                  borderBottomWidth="1px"
                  borderColor="border.subtle"
                  display="flex"
                  alignItems="center"
                  gap="3"
                >
                  <Avatar name={user.name} size={42} />
                  <Stack gap="0" flex="1" minW="0">
                    <Text
                      fontSize="16.5px"
                      fontWeight="700"
                      letterSpacing="-0.02em"
                      lineClamp={1}
                    >
                      {user.name}
                    </Text>
                    <Text fontFamily="mono" fontSize="11.5px" color="fg.subtle">
                      {user.id}
                    </Text>
                  </Stack>
                  <Drawer.CloseTrigger asChild>
                    <CloseButton size="sm" />
                  </Drawer.CloseTrigger>
                </Drawer.Header>

                <Drawer.Body>
                  <GeoMap
                    lat={user.latitude}
                    lon={user.longitude}
                    label={cityState(user)}
                  />
                  <Flex align="center" gap="2" mt="3" mb="5.5" fontSize="12.5px" color="fg.subtle">
                    <Clock size={14} strokeWidth={2} />
                    Local time
                    <Text as="span" fontFamily="mono" color="fg.muted">
                      {localTime(user.timezone)}
                    </Text>
                    <Badge
                      ml="auto"
                      bg="brand.subtle"
                      color="brand.fg"
                      borderRadius="full"
                      px="2"
                    >
                      <Text fontFamily="mono" fontSize="11.5px">
                        {tzChip(user.timezone)}
                      </Text>
                    </Badge>
                  </Flex>

                  <Text
                    fontSize="11.5px"
                    fontWeight="700"
                    color="fg.subtle"
                    textTransform="uppercase"
                    letterSpacing="0.06em"
                    mb="3"
                  >
                    Editable
                  </Text>
                  <Stack gap="3.5" mb="6">
                    <Stack gap="1.5">
                      <Text fontSize="13px" fontWeight="600">
                        Full name
                      </Text>
                      <Input value={name} onChange={(e) => setName(e.target.value)} />
                    </Stack>
                    <Stack gap="1.5">
                      <Text fontSize="13px" fontWeight="600">
                        Zip code
                      </Text>
                      <InputGroup
                        endElement={
                          zipChanged && !zipValid ? (
                            <Box color="error.solid">
                              <AlertCircle size={16} />
                            </Box>
                          ) : (
                            <Box color="fg.subtle">
                              <MapPin size={16} />
                            </Box>
                          )
                        }
                      >
                        <Input
                          value={zip}
                          inputMode="numeric"
                          maxLength={5}
                          fontFamily="mono"
                          onChange={(e) => setZip(e.target.value.replace(/[^\d]/g, ""))}
                          borderColor={zipChanged && !zipValid ? "error.solid" : undefined}
                        />
                      </InputGroup>
                      {zipChanged && !zipValid ? (
                        <Flex align="center" gap="1.5" color="error.solid" fontSize="12.5px">
                          <AlertCircle size={14} /> Zip codes are 5 digits.
                        </Flex>
                      ) : zipChanged ? (
                        <Text fontSize="12.5px" color="success.fg">
                          Will re-resolve city, timezone &amp; coordinates.
                        </Text>
                      ) : (
                        <Text fontSize="12.5px" color="fg.subtle">
                          Changing this re-resolves location data.
                        </Text>
                      )}
                    </Stack>
                  </Stack>

                  <Text
                    fontSize="11.5px"
                    fontWeight="700"
                    color="fg.subtle"
                    textTransform="uppercase"
                    letterSpacing="0.06em"
                    mb="1"
                  >
                    Enriched from zip
                  </Text>
                  <DataRow label="City">{cityState(user)}</DataRow>
                  <DataRow label="Timezone" mono>
                    {tzFull(user.timezone)}
                  </DataRow>
                  <DataRow label="Latitude" mono>
                    {user.latitude.toFixed(6)}
                  </DataRow>
                  <DataRow label="Longitude" mono>
                    {user.longitude.toFixed(6)}
                  </DataRow>
                  <DataRow label="Added">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </DataRow>
                </Drawer.Body>

                <Drawer.Footer
                  borderTopWidth="1px"
                  borderColor="border.subtle"
                  bg="bg.subtle"
                >
                  {confirmDelete ? (
                    <Flex align="center" gap="2.5" width="full">
                      <Text fontSize="13px" color="fg.muted" flex="1">
                        Delete <strong>{user.name}</strong>? This can’t be undone.
                      </Text>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setConfirmDelete(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        colorPalette="red"
                        loading={deleting}
                        onClick={remove}
                      >
                        Delete
                      </Button>
                    </Flex>
                  ) : (
                    <Flex align="center" gap="2.5" width="full">
                      <Button
                        variant="outline"
                        size="sm"
                        colorPalette="red"
                        onClick={() => setConfirmDelete(true)}
                      >
                        <Trash2 size={15} /> Delete
                      </Button>
                      <Flex ml="auto" align="center" gap="2.5">
                        {justSaved && (
                          <Flex align="center" gap="1.5" color="success.solid" fontSize="13px">
                            <Check size={15} /> Saved
                          </Flex>
                        )}
                        <Button
                          colorPalette="brand"
                          disabled={!canSave}
                          loading={saving}
                          onClick={save}
                        >
                          Save changes
                        </Button>
                      </Flex>
                    </Flex>
                  )}
                </Drawer.Footer>
              </>
            )}
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
