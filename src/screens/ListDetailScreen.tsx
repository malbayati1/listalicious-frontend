import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import { useAudioPlayer } from "expo-audio";
import { addItem, checkItem, clearCheckedItems, deleteItem, getItems, updateItem } from "../api/listApi";
import { Item } from "../types/Item";
import BackButton from "../components/BackButton";
import PrimaryButton from "../components/PrimaryButton";
import BottomSheet from "../components/BottomSheet";
import Confetti from "../components/Confetti";
import CheckIcon from "../components/icons/CheckIcon";
import PlusIcon from "../components/icons/PlusIcon";
import { colors } from "../theme/tokens";
import styles from "./styles/ListDetailScreenStyles";

function itemQtyLabel(item: Item): string {
  return item.unit ? `${item.quantity} × ${item.unit}` : `×${item.quantity}`;
}

type SheetState =
  | { mode: "closed" }
  | { mode: "add" }
  | { mode: "edit"; item: Item };

export default function ListDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id, title } = useLocalSearchParams<{ id: string; title?: string }>();
  const [items, setItems] = useState<Item[] | null>(null);
  const [loadError, setLoadError] = useState<string | undefined>();
  const [clearing, setClearing] = useState(false);

  const [sheet, setSheet] = useState<SheetState>({ mode: "closed" });
  const [draftName, setDraftName] = useState("");
  const [draftQty, setDraftQty] = useState(1);
  const [draftNote, setDraftNote] = useState("");
  const [draftError, setDraftError] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);

  const [celebrationTrigger, setCelebrationTrigger] = useState(0);
  const wasAllDone = useRef(false);
  const chimePlayer = useAudioPlayer(require("../../assets/sounds/success-chime.wav"));

  const load = useCallback(async () => {
    if (!id) {
      return;
    }
    setLoadError(undefined);
    try {
      const fetched = await getItems(id);
      setItems(fetched);
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
        } else {
          const updated = await updateItem(id, sheet.item.id, {
            name: trimmedName,
            quantity: draftQty,
            note: draftNote.trim(),
          });
          setItems((current) => (current ? current.map((i) => (i.id === updated.id ? updated : i)) : current));
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

  const handleRemove = () => {
    if (!id || sheet.mode !== "edit") {
      return;
    }
    const itemId = sheet.item.id;
    const submit = async () => {
      setSaving(true);
      try {
        await deleteItem(id, itemId);
        setItems((current) => (current ? current.filter((i) => i.id !== itemId) : current));
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
                  onPress={openShareScreen}
                  style={({ pressed }) => [styles.invitePill, pressed && styles.invitePillPressed]}
                >
                  <PlusIcon size={16} color={colors.mint} />
                  <Text style={styles.invitePillLabel}>Invite</Text>
                </Pressable>
              </View>
            </View>
            <Text style={styles.title} numberOfLines={1}>
              {title ?? "List"}
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
        <Text style={styles.sheetTitle}>{sheet.mode === "edit" ? "Edit item" : `Add to ${title ?? "list"}`}</Text>
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
        ) : null}
      </BottomSheet>

      <Confetti trigger={celebrationTrigger} />
    </SafeAreaView>
  );
}
