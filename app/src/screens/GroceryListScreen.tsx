import React, { useState } from "react";
import { View, FlatList } from "react-native";
import { TextInput, Button, List, IconButton, Text } from "react-native-paper";

export default function GroceryListScreen() {
  const [item, setItem] = useState("");
  const [items, setItems] = useState<string[]>([]);

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

  return (
    <View style={{ flex: 1, padding: 20, paddingTop: 60 }}>
      <Text variant="headlineSmall" style={{ marginBottom: 20 }}>
        Grocery List
      </Text>

      <TextInput
        label="Add Item"
        value={item}
        onChangeText={setItem}
        style={{ marginBottom: 10 }}
      />

      <Button mode="contained" onPress={addItem} style={{ marginBottom: 20 }}>
        Add
      </Button>

      {items.length === 0 ? (
        <Text style={{ textAlign: "center", color: "gray" }}>No items yet</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <List.Item
              title={item}
              right={() => (
                <IconButton
                  icon="delete"
                  onPress={() => removeItem(index)}
                  accessibilityLabel={`Delete ${item}`}
                />
              )}
            />
          )}
        />
      )}
    </View>
  );
}
