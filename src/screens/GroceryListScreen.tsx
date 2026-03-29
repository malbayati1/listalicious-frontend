import React, { useState, useEffect, useCallback } from "react";
import { View, FlatList, Alert } from "react-native";
import { TextInput, Button, List, IconButton, Text, Checkbox, ActivityIndicator } from "react-native-paper";
import styles from "./styles/GroceryListScreenStyles";
import { useAuth } from "../context/AuthContext";
import { router } from "expo-router";
import { getLists, createList, getItems, addItem, deleteItem, toggleItem } from "../api/listApi";
import { Item } from "../types/Item";

export default function GroceryListScreen() {
  const [itemName, setItemName] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [listId, setListId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const { logout } = useAuth();

  const initList = useCallback(async () => {
    setLoading(true);
    try {
      const lists = await getLists();
      const list = lists.length > 0 ? lists[0] : await createList("My List");
      setListId(list._id);
      const fetchedItems = await getItems(list._id);
      setItems(fetchedItems);
    } catch {
      Alert.alert("Error", "Could not load your grocery list.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initList();
  }, [initList]);

  const handleAddItem = async () => {
    if (!itemName.trim() || !listId) return;
    setAdding(true);
    try {
      const newItem = await addItem(listId, itemName.trim());
      setItems((prev) => [...prev, newItem]);
      setItemName("");
    } catch {
      Alert.alert("Error", "Could not add item.");
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteItem = async (item: Item) => {
    if (!listId) return;
    setItems((prev) => prev.filter((i) => i._id !== item._id));
    try {
      await deleteItem(listId, item._id);
    } catch {
      setItems((prev) => [...prev, item]);
      Alert.alert("Error", "Could not delete item.");
    }
  };

  const handleToggleItem = async (item: Item) => {
    if (!listId) return;
    setItems((prev) => prev.map((i) => (i._id === item._id ? { ...i, is_checked: !i.is_checked } : i)));
    try {
      await toggleItem(listId, item._id, !item.is_checked);
    } catch {
      setItems((prev) => prev.map((i) => (i._id === item._id ? { ...i, is_checked: item.is_checked } : i)));
      Alert.alert("Error", "Could not update item.");
    }
  };

  const onLogout = async () => {
    await logout();
    router.replace("/(auth)");
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={onLogout} style={styles.addButton}>
        logout
      </Button>

      <Text variant="headlineSmall" style={styles.headline}>
        Grocery List
      </Text>

      <TextInput
        label="Add Item"
        value={itemName}
        onChangeText={setItemName}
        style={styles.input}
        onSubmitEditing={handleAddItem}
      />

      <Button mode="contained" onPress={handleAddItem} style={styles.addButton} loading={adding} disabled={adding}>
        Add
      </Button>

      {items.length === 0 ? (
        <Text style={styles.emptyText}>No items yet</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => i._id}
          renderItem={({ item }) => (
            <List.Item
              title={item.name}
              titleStyle={item.is_checked ? { textDecorationLine: "line-through", color: "gray" } : undefined}
              left={() => (
                <Checkbox
                  status={item.is_checked ? "checked" : "unchecked"}
                  onPress={() => handleToggleItem(item)}
                />
              )}
              right={() => (
                <IconButton
                  icon="delete"
                  onPress={() => handleDeleteItem(item)}
                  accessibilityLabel={`Delete ${item.name}`}
                />
              )}
            />
          )}
        />
      )}
    </View>
  );
}
