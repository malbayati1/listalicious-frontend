import React, { useState, useRef } from "react";
import { View, Keyboard, TouchableWithoutFeedback, Platform } from "react-native";
import { Text, Button, TextInput } from "react-native-paper";
import { useAuth } from "../context/AuthContext";
import { router } from "expo-router";
import styles from "./styles/LoginScreenStyles";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const passwordRef = useRef(null);
  const { login } = useAuth();

  const handleLogin = () => {
    if (!email || !password) {
      alert("Error: Please enter both email and password.");
      return;
    }

    const loginData = async () => {
      try {
        const res = await login(email, password);
        console.log("Login successful:", res);
        router.replace("/(app)");
      } catch (error) {
        console.error("Login failed:", error);
        alert("Login failed. Please try again." + error);
      }
    };
    loginData();
  };

  const content = (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Welcome Back
      </Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        mode="outlined"
        autoCapitalize="none"
        keyboardType="email-address"
        returnKeyType="next"
        onSubmitEditing={
          Platform.OS === "ios" || Platform.OS === "android"
            ? // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
              () => passwordRef.current && (passwordRef.current as any).focus()
            : handleLogin
        }
      />
      <TextInput
        ref={passwordRef}
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        mode="outlined"
        autoCapitalize="none"
        returnKeyType="done"
        onSubmitEditing={handleLogin}
      />

      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Log In
      </Button>

      <Button onPress={() => router.push("./register")} style={styles.link}>
        Don't have an account? Sign up
      </Button>
    </View>
  );

  if (Platform.OS === "ios" || Platform.OS === "android") {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        {content}
      </TouchableWithoutFeedback>
    );
  }
  return content;
}
