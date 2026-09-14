import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import { useAudioPlayer } from "expo-audio";
import {
  addItem,
  addItemsBulk,
  checkItem,
  clearCheckedItems,
  deleteItem,
  deleteList,
  getItems,
  getList,
  leaveList,
  NewItemData,
  renameList,
  updateItem,
} from "../api/listApi";
import { Item } from "../types/Item";
import { GroceryList } from "../types/GroceryList";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import BackButton from "../components/BackButton";
import PrimaryButton from "../components/PrimaryButton";
import BottomSheet from "../components/BottomSheet";
import Confetti from "../components/Confetti";
import BarChartIcon from "../components/icons/BarChartIcon";
import CheckIcon from "../components/icons/CheckIcon";
import MoreIcon from "../components/icons/MoreIcon";
import PlusIcon from "../components/icons/PlusIcon";
import { colors } from "../theme/tokens";
import styles from "./styles/ListDetailScreenStyles";

function itemQtyLabel(item: Item): string {
  return item.unit ? `${item.quantity} × ${item.unit}` : `×${item.quantity}`;
}

const BULK_LINE_PATTERN = /^(\d+)\s*[xX]?\s+(.+)$/;

function parseBulkLines(text: string): NewItemData[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      const match = line.match(BULK_LINE_PATTERN);
      if (match) {
        return { name: match[2].trim(), quantity: Math.max(1, parseInt(match[1], 10)) };
      }
      return { name: line, quantity: 1 };
    });
}

type SheetState =
  | { mode: "closed" }
  | { mode: "add" }
  | { mode: "edit"; item: Item };

export default function ListDetailScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { showToast } = useToast();
  const selfInitial = user?.username || user?.email || "?";
  const { id, title } = useLocalSearchParams<{ id: string; title?: string }>();
  const [items, setItems] = useState<Item[] | null>(null);
  const [list, setList] = useState<GroceryList | null>(null);
  const [loadError, setLoadError] = useState<string | undefined>();
  const [clearing, setClearing] = useState(false);

  const [sheet, setSheet] = useState<SheetState>({ mode: "closed" });
  const [draftName, setDraftName] = useState("");
  const [draftQty, setDraftQty] = useState(1);
  const [draftNote, setDraftNote] = useState("");
  const [draftError, setDraftError] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);

  const [bulkMode, setBulkMode] = useState(false);
  const [bulkText, setBulkText] = useState("");
  const [bulkError, setBulkError] = useState<string | undefined>();
  const [bulkSaving, setBulkSaving] = useState(false);

  const [manageSheet, setManageSheet] = useState<"closed" | "menu" | "rename" | "delete" | "leave">("closed");
  const [renameValue, setRenameValue] = useState("");
  const [renameError, setRenameError] = useState<string | undefined>();
  const [renaming, setRenaming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const [celebrationTrigger, setCelebrationTrigger] = useState(0);
  const wasAllDone = useRef(false);
  const chimePlayer = useAudioPlayer(require("../../assets/sounds/success-chime.wav"));

  const load = useCallback(async () => {
    if (!id) {
      return;
    }
    setLoadError(undefined);
    try {
      const [fetchedItems, fetchedList] = await Promise.all([getItems(id), getList(id)]);
      setItems(fetchedItems);
      setList(fetchedList);
    } catch (error) {
      console.error("Failed to load items:", error);
      setLoadError("Couldn't load this list. Check your connection and try again.");
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const total = items?.length ?? 0;
  const done = items?.filter((item) => item.is_checked).length ?? 0;
  const progress = total > 0 ? done / total : 0;
  const allDone = total > 0 && done === total;

  useEffect(() => {
    if (allDone && !wasAllDone.current) {
      setCelebrationTrigger((n) => n + 1);
      chimePlayer.seekTo(0);
      chimePlayer.play();
    }
    wasAllDone.current = allDone;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDone]);

  const handleToggle = (item: Item) => {
    if (!id || !items) {
      return;
    }
    setItems(items.map((i) => (i.id === item.id ? { ...i, is_checked: !i.is_checked } : i)));
    checkItem(id, item.id).catch((error) => {
      console.error("Failed to toggle item:", error);
      setItems((current) =>
        current ? current.map((i) => (i.id === item.id ? { ...i, is_checked: item.is_checked } : i)) : current
      );
    });
  };

  const openAddSheet = () => {
    setDraftName("");
    setDraftQty(1);
    setDraftNote("");
    setDraftError(undefined);
    setBulkMode(false);
    setBulkText("");
    setBulkError(undefined);
    setSheet({ mode: "add" });
  };

  const openEditSheet = (item: Item) => {
    setDraftName(item.name);
    setDraftQty(item.quantity);
    setDraftNote(item.note ?? "");
    setDraftError(undefined);
    setSheet({ mode: "edit", item });
  };

  const closeSheet = () => setSheet({ mode: "closed" });

  const handleCommit = () => {
    const trimmedName = draftName.trim();
    if (!trimmedName) {
      setDraftError("Give it a name first");
      return;
    }
    if (!id || sheet.mode === "closed") {
      return;
    }

    const submit = async () => {
      setSaving(true);
      try {
        if (sheet.mode === "add") {
          const created = await addItem(id, { name: trimmedName, quantity: draftQty, note: draftNote.trim() });
          setItems((current) => (current ? [...current, created] : [created]));
          showToast(`Added ${created.name}`, selfInitial);
        } else {
          const updated = await updateItem(id, sheet.item.id, {
            name: trimmedName,
            quantity: draftQty,
            note: draftNote.trim(),
          });
          setItems((current) => (current ? current.map((i) => (i.id === updated.id ? updated : i)) : current));
          showToast(`Updated ${updated.name}`, selfInitial);
        }
        closeSheet();
      } catch (error) {
        console.error("Failed to save item:", error);
        setDraftError("Couldn't save that item. Try again.");
      } finally {
        setSaving(false);
      }
    };
    submit();
  };

  const handleBulkCommit = () => {
    const parsed = parseBulkLines(bulkText);
    if (parsed.length === 0) {
      setBulkError("Add at least one item, one per line");
      return;
    }
    if (parsed.length > 50) {
      setBulkError("That's a lot — split it into batches of 50 or fewer");
      return;
    }
    if (!id) {
      return;
    }
    setBulkError(undefined);
    const submit = async () => {
      setBulkSaving(true);
      try {
        const created = await addItemsBulk(id, parsed);
        setItems((current) => (current ? [...current, ...created] : created));
        showToast(`Added ${created.length} item${created.length === 1 ? "" : "s"}`, selfInitial);
        closeSheet();
      } catch (error) {
        console.error("Failed to bulk add items:", error);
        setBulkError("Couldn't add those items. Try again.");
      } finally {
        setBulkSaving(false);
      }
    };
    submit();
  };

  const handleRemove = () => {
    if (!id || sheet.mode !== "edit") {
      return;
    }
    const itemId = sheet.item.id;
    const itemName = sheet.item.name;
    const submit = async () => {
      setSaving(true);
      try {
        await deleteItem(id, itemId);
        setItems((current) => (current ? current.filter((i) => i.id !== itemId) : current));
        showToast(`Removed ${itemName}`, selfInitial);
        closeSheet();
      } catch (error) {
        console.error("Failed to remove item:", error);
        setDraftError("Couldn't remove that item. Try again.");
      } finally {
        setSaving(false);
      }
    };
    submit();
  };

  const handleClearChecked = () => {
    if (!id) {
      return;
    }
    const submit = async () => {
      setClearing(true);
      try {
        await clearCheckedItems(id);
        setItems((current) => (current ? current.filter((i) => !i.is_checked) : current));
      } catch (error) {
        console.error("Failed to clear checked items:", error);
      } finally {
        setClearing(false);
      }
    };
    submit();
  };

  const openShareScreen = () => {
    router.push({ pathname: "/(app)/list/[id]/share", params: { id, title } });
  };

  const openStatsScreen = () => {
    router.push({ pathname: "/(app)/list/[id]/stats", params: { id, title } });
  };

  const isOwner = Boolean(list && user && list.owner_id === user._id);
  const displayTitle = list?.title ?? title ?? "List";

  const closeManageSheet = () => setManageSheet("closed");

  const openRenameSheet = () => {
    setRenameValue(displayTitle);
    setRenameError(undefined);
    setManageSheet("rename");
  };

  const handleRename = () => {
    const trimmed = renameValue.trim();
    if (!trimmed) {
      setRenameError("Give it a name first");
      return;
    }
    if (!id) {
      return;
    }
    setRenameError(undefined);
    const submit = async () => {
      setRenaming(true);
      try {
        const updated = await renameList(id, trimmed);
        setList(updated);
        closeManageSheet();
        showToast(`Renamed to "${updated.title}"`, selfInitial);
      } catch (error) {
        console.error("Failed to rename list:", error);
        setRenameError("Couldn't rename this list. Try again.");
      } finally {
        setRenaming(false);
      }
    };
    submit();
  };

  const handleDelete = () => {
    if (!id) {
      return;
    }
    const submit = async () => {
      setDeleting(true);
      try {
        await deleteList(id);
        showToast(`Deleted "${displayTitle}"`, selfInitial);
        router.replace("/(app)/(tabs)");
      } catch (error) {
        console.error("Failed to delete list:", error);
        setDeleting(false);
      }
    };
    submit();
  };

  const handleLeave = () => {
    if (!id) {
      return;
    }
    const submit = async () => {
      setLeaving(true);
      try {
        await leaveList(id);
        showToast(`Left "${displayTitle}"`, selfInitial);
        router.replace("/(app)/(tabs)");
      } catch (error) {
        console.error("Failed to leave list:", error);
        setLeaving(false);
      }
    };
    submit();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar style="light" />

      {items === null && !loadError ? (
        <View style={styles.centerFill}>
          <ActivityIndicator size="large" color={colors.mint} />
        </View>
      ) : loadError ? (
        <View style={[styles.centerFill, { paddingHorizontal: 28 }]}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorBody}>{loadError}</Text>
          <PrimaryButton label="Try again" onPress={load} />
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <View style={styles.topRow}>
              <BackButton />
              <View style={styles.topRowRight}>
                <Pressable
                  testID="stats-button"
                  onPress={openStatsScreen}
                  style={({ pressed }) => [styles.statsButton, pressed && styles.statsButtonPressed]}
                >
                  <BarChartIcon size={18} color={colors.ink} />
                </Pressable>
                <Pressable
                  testID="manage-list-button"
                  onPress={() => setManageSheet("menu")}
                  style={({ pressed }) => [styles.statsButton, pressed && styles.statsButtonPressed]}
                >
                  <MoreIcon size={18} color={colors.ink} />
                </Pressable>
                <Pressable
                  onPress={openShareScreen}
                  style={({ pressed }) => [styles.invitePill, pressed && styles.invitePillPressed]}
                >
                  <PlusIcon size={16} color={colors.mint} />
                  <Text style={styles.invitePillLabel}>Invite</Text>
                </Pressable>
              </View>
            </View>
            <Text style={styles.title} numberOfLines={1}>
              {displayTitle}
            </Text>
            <View style={styles.progressRow}>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]} />
              </View>
              <Text style={styles.progressLabel}>
                {total === 0 ? "0%" : `${done}/${total}`}
              </Text>
            </View>
          </View>

          <View style={{ flex: 1 }}>
            {total === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Nothing on this list yet.{"\n"}Tap Add to get started.</Text>
              </View>
            ) : (
              <View style={[styles.scrollContent, { paddingBottom: 130 + insets.bottom }]}>
                <View style={styles.groupHeader}>
                  <Text style={styles.groupLabel}>ITEMS</Text>
                  <View style={styles.groupHairline} />
                  <Text style={styles.groupCount}>{total}</Text>
                </View>
                <View style={styles.itemList}>
                  {items?.map((item) => (
                    <View key={item.id} style={styles.itemRow}>
                      <Pressable
                        testID={`item-checkbox-${item.id}`}
                        onPress={() => handleToggle(item)}
                        style={[styles.checkbox, item.is_checked && styles.checkboxChecked]}
                        hitSlop={8}
                      >
                        {item.is_checked ? <CheckIcon /> : null}
                      </Pressable>
                      <Pressable style={styles.itemTextBlock} onPress={() => openEditSheet(item)}>
                        <Text style={[styles.itemName, item.is_checked && styles.itemNameChecked]} numberOfLines={1}>
                          {item.name}
                        </Text>
                        <View style={styles.itemMetaRow}>
                          <Text style={styles.itemQty}>{itemQtyLabel(item)}</Text>
                          {item.note ? (
                            <Text style={styles.itemNote} numberOfLines={1}>
                              · {item.note}
                            </Text>
                          ) : null}
                        </View>
                      </Pressable>
                    </View>
                  ))}
                </View>

                {allDone ? (
                  <View style={styles.finishCard}>
                    <Text style={styles.finishTitle}>That's the lot.</Text>
                    <Text style={styles.finishBody}>Go home. Put the kettle on.</Text>
                    <Pressable
                      style={styles.clearButton}
                      onPress={handleClearChecked}
                      disabled={clearing}
                    >
                      {clearing ? (
                        <ActivityIndicator size="small" color={colors.mintInk} />
                      ) : (
                        <Text style={styles.clearButtonLabel}>Clear bought items</Text>
                      )}
                    </Pressable>
                  </View>
                ) : null}
              </View>
            )}
          </View>

          <Pressable
            onPress={openAddSheet}
            style={({ pressed }) => [styles.fab, { bottom: 24 + insets.bottom }, pressed && styles.fabPressed]}
          >
            <PlusIcon size={20} color={colors.mintInk} />
            <Text style={styles.fabLabel}>Add</Text>
          </Pressable>
        </>
      )}

      <BottomSheet visible={sheet.mode !== "closed"} onClose={closeSheet}>
        {bulkMode ? (
          <>
            <Text style={styles.sheetTitle}>Paste a list</Text>
            <TextInput
              autoFocus
              multiline
              value={bulkText}
              onChangeText={setBulkText}
              placeholder={"One item per line, e.g.\nBananas\n2 Milk\n3x Eggs"}
              placeholderTextColor={colors.faint}
              style={styles.bulkInput}
            />
            {bulkError ? <Text style={styles.nameError}>{bulkError}</Text> : null}
            <PrimaryButton label="Add items" onPress={handleBulkCommit} loading={bulkSaving} />
            <Pressable style={styles.bulkToggle} onPress={() => setBulkMode(false)}>
              <Text style={styles.bulkToggleLabel}>Back to adding one at a time</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.sheetTitle}>{sheet.mode === "edit" ? "Edit item" : `Add to ${displayTitle}`}</Text>
            <TextInput
              autoFocus
              value={draftName}
              onChangeText={setDraftName}
              placeholder="What are we buying?"
              placeholderTextColor={colors.faint}
              style={styles.nameInput}
            />
            {draftError ? <Text style={styles.nameError}>{draftError}</Text> : null}
            <View style={styles.sheetRow}>
              <View style={styles.stepper}>
                <Pressable
                  style={({ pressed }) => [styles.stepperButton, pressed && styles.stepperButtonPressed]}
                  onPress={() => setDraftQty((q) => Math.max(1, q - 1))}
                >
                  <Text style={styles.stepperButtonLabel}>−</Text>
                </Pressable>
                <Text style={styles.stepperValue}>{draftQty}</Text>
                <Pressable
                  style={({ pressed }) => [styles.stepperButton, pressed && styles.stepperButtonPressed]}
                  onPress={() => setDraftQty((q) => Math.min(9999, q + 1))}
                >
                  <Text style={styles.stepperButtonLabel}>+</Text>
                </Pressable>
              </View>
              <TextInput
                value={draftNote}
                onChangeText={setDraftNote}
                placeholder="Note — brand, ripeness…"
                placeholderTextColor={colors.faint}
                style={styles.noteInput}
              />
            </View>
            <PrimaryButton
              label={sheet.mode === "edit" ? "Save changes" : "Add it"}
              onPress={handleCommit}
              loading={saving}
            />
            {sheet.mode === "edit" ? (
              <Pressable style={styles.removeButton} onPress={handleRemove}>
                <Text style={styles.removeButtonLabel}>Remove from list</Text>
              </Pressable>
            ) : (
              <Pressable style={styles.bulkToggle} onPress={() => setBulkMode(true)}>
                <Text style={styles.bulkToggleLabel}>Paste multiple items at once</Text>
              </Pressable>
            )}
          </>
        )}
      </BottomSheet>

      <BottomSheet visible={manageSheet === "menu"} onClose={closeManageSheet}>
        <Text style={styles.sheetTitle}>{displayTitle}</Text>
        {isOwner ? (
          <>
            <Pressable style={styles.manageMenuItem} onPress={openRenameSheet}>
              <Text style={styles.manageMenuItemLabel}>Rename list</Text>
            </Pressable>
            <Pressable style={styles.manageMenuItem} onPress={() => setManageSheet("delete")}>
              <Text style={[styles.manageMenuItemLabel, styles.manageMenuItemDanger]}>Delete list</Text>
            </Pressable>
          </>
        ) : (
          <Pressable style={styles.manageMenuItem} onPress={() => setManageSheet("leave")}>
            <Text style={[styles.manageMenuItemLabel, styles.manageMenuItemDanger]}>Leave list</Text>
          </Pressable>
        )}
      </BottomSheet>

      <BottomSheet visible={manageSheet === "rename"} onClose={closeManageSheet}>
        <Text style={styles.sheetTitle}>Rename list</Text>
        <TextInput
          autoFocus
          value={renameValue}
          onChangeText={setRenameValue}
          placeholder="List name"
          placeholderTextColor={colors.faint}
          style={styles.nameInput}
          onSubmitEditing={handleRename}
          returnKeyType="done"
        />
        {renameError ? <Text style={styles.nameError}>{renameError}</Text> : null}
        <PrimaryButton label="Save name" onPress={handleRename} loading={renaming} />
      </BottomSheet>

      <BottomSheet visible={manageSheet === "delete"} onClose={closeManageSheet}>
        <Text style={styles.sheetTitle}>Delete "{displayTitle}"?</Text>
        <Text style={styles.sheetBody}>
          This removes the list, its items, and its activity history for everyone it's shared with. This can't be
          undone.
        </Text>
        <Pressable style={styles.removeButtonSolid} onPress={handleDelete} disabled={deleting}>
          {deleting ? (
            <ActivityIndicator size="small" color={colors.danger} />
          ) : (
            <Text style={styles.removeButtonSolidLabel}>Delete list</Text>
          )}
        </Pressable>
        <Pressable style={styles.manageCancel} onPress={closeManageSheet}>
          <Text style={styles.manageCancelLabel}>Cancel</Text>
        </Pressable>
      </BottomSheet>

      <BottomSheet visible={manageSheet === "leave"} onClose={closeManageSheet}>
        <Text style={styles.sheetTitle}>Leave "{displayTitle}"?</Text>
        <Text style={styles.sheetBody}>
          You'll lose access to this list. Anyone still on it can re-invite you later if you change your mind.
        </Text>
        <Pressable style={styles.removeButtonSolid} onPress={handleLeave} disabled={leaving}>
          {leaving ? (
            <ActivityIndicator size="small" color={colors.danger} />
          ) : (
            <Text style={styles.removeButtonSolidLabel}>Leave list</Text>
          )}
        </Pressable>
        <Pressable style={styles.manageCancel} onPress={closeManageSheet}>
          <Text style={styles.manageCancelLabel}>Cancel</Text>
        </Pressable>
      </BottomSheet>

      <Confetti trigger={celebrationTrigger} />
    </SafeAreaView>
  );
}
