import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { Keyboard, Platform, TouchableWithoutFeedback, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { registerUser } from "../api/authApi";
import styles from "./styles/LoginScreenStyles";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const handleRegister = () => {
    const registerData = async () => {
      try {
        const req = {
          email: email,
          username: "NewUser",
          password: password,
        };
        const res = await registerUser(req);
        console.log("Registration successful:", res);
        router.replace("./login");
      } catch (error) {
        console.error("Registration failed:", error);
        alert("Registration failed. Please try again.");
      }
    };

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    console.log("Registering...", email);
    registerData();
  };

  const content = (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Create Account
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
            ? () => passwordRef.current && (passwordRef.current as any).focus()
            : handleRegister
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
        returnKeyType="next"
        onSubmitEditing={
          Platform.OS === "ios" || Platform.OS === "android"
            ? () => confirmPasswordRef.current && (confirmPasswordRef.current as any).focus()
            : handleRegister
        }
      />
      <TextInput
        ref={confirmPasswordRef}
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
        mode="outlined"
        autoCapitalize="none"
        returnKeyType="done"
        onSubmitEditing={handleRegister}
      />

      <Button mode="contained" onPress={handleRegister} style={styles.button}>
        Sign Up
      </Button>

      <Button onPress={() => router.push("./login")} style={styles.link}>
        Already have an account? Log in
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
