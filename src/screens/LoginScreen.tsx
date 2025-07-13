import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, TextInput, useTheme } from "react-native-paper";
import { router } from "expo-router";
import styles from "./styles/LoginScreenStyles";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const theme = useTheme();

  const handleLogin = () => {
    // Simulate login success
    console.log("Logging in...", email);
    router.replace("./GroceryList");
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Welcome Back
      </Text>

      <TextInput label="Email" value={email} onChangeText={setEmail} style={styles.input} mode="outlined" />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        mode="outlined"
      />

      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Log In
      </Button>

      <Button onPress={() => router.push("./register")} style={styles.link}>
        Don't have an account? Sign up
      </Button>
    </View>
  );
}
