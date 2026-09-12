import React, { useRef, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { useAuth } from "../context/AuthContext";
import BackButton from "../components/BackButton";
import AuthTextField from "../components/AuthTextField";
import PrimaryButton from "../components/PrimaryButton";
import styles from "./styles/AuthFormScreenStyles";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef<TextInput>(null);

  const handleLogin = () => {
    const trimmedEmail = email.trim();
    setEmailError(undefined);
    setPasswordError(undefined);
    setFormError(undefined);

    let hasError = false;
    if (!trimmedEmail) {
      setEmailError("Enter your email");
      hasError = true;
    }
    if (!password) {
      setPasswordError("Enter your password");
      hasError = true;
    }
    if (hasError) {
      return;
    }

    const submit = async () => {
      setLoading(true);
      try {
        await login(trimmedEmail, password);
        router.replace("/(app)");
      } catch (error) {
        console.error("Login failed:", error);
        setFormError("Couldn't log you in. Check your email and password.");
      } finally {
        setLoading(false);
      }
    };
    submit();
  };

  const content = (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <StatusBar style="light" />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.content}>
          <BackButton />

          <View style={styles.form}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={[styles.subtitle, { marginBottom: 32 }]}>The fridge missed you.</Text>

            <AuthTextField
              label="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
              error={emailError}
              onSubmitEditing={() => passwordRef.current?.focus()}
              style={{ marginBottom: 18 }}
            />
            <AuthTextField
              ref={passwordRef}
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              returnKeyType="done"
              error={passwordError}
              onSubmitEditing={handleLogin}
            />

            <Text style={styles.forgotPassword}>Forgot password?</Text>

            {formError ? <Text style={styles.formError}>{formError}</Text> : null}
          </View>

          <View style={[styles.footer, { paddingBottom: 44 + insets.bottom }]}>
            <PrimaryButton label="Log in" onPress={handleLogin} loading={loading} style={{ marginBottom: 16 }} />
            <Pressable onPress={() => router.push("./register")}>
              <Text style={styles.footerText}>
                No account yet? <Text style={styles.footerTextStrong}>Sign up</Text>
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
