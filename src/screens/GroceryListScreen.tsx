import React, { useState } from "react";
import { View, FlatList } from "react-native";
import { TextInput, Button, List, IconButton, Text } from "react-native-paper";
import styles from "./styles/GroceryListScreenStyles";
import { useAuth } from "../context/AuthContext";
import { router } from "expo-router";

export default function GroceryListScreen() {
  const [item, setItem] = useState("");
  const [items, setItems] = useState<string[]>([]);
  const { logout } = useAuth();

  const addItem = () => {
    if (item) {
      setItems([...items, item.trim()]);
      setItem("");
    }
  };

  const removeItem = (index: number) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const onLogout = async () => {
    await logout();
    router.replace("/(auth)");
  }

  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={onLogout} style={styles.addButton}>
        logout
      </Button>
      
      <Text variant="headlineSmall" style={styles.headline}>
        Grocery List
      </Text>

      <TextInput label="Add Item" value={item} onChangeText={setItem} style={styles.input} />

      <Button mode="contained" onPress={addItem} style={styles.addButton}>
        Add
      </Button>

      {items.length === 0 ? (
        <Text style={styles.emptyText}>No items yet</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <List.Item
              title={item}
              right={() => (
                <IconButton icon="delete" onPress={() => removeItem(index)} accessibilityLabel={`Delete ${item}`} />
              )}
            />
          )}
        />
      )}
    </View>
  );
}
