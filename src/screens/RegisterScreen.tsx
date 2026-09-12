import React, { useRef, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { registerUser } from "../api/authApi";
import BackButton from "../components/BackButton";
import AuthTextField from "../components/AuthTextField";
import PrimaryButton from "../components/PrimaryButton";
import styles from "./styles/AuthFormScreenStyles";

function parseRegisterError(error: unknown): string {
  const detail = (error as { response?: { data?: { detail?: unknown } } }).response?.data?.detail;
  if (typeof detail === "string") {
    return detail;
  }
  if (Array.isArray(detail) && detail.length > 0) {
    return (detail as unknown[])
      .map((item) => (typeof item === "object" && item !== null && "msg" in item ? String((item as { msg: unknown }).msg) : String(item)))
      .join("\n");
  }
  return "Registration failed. Please try again.";
}

const isPasswordValid = (password: string) => password.length >= 8 && /\d/.test(password);

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState<string | undefined>();
  const [emailError, setEmailError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const handleRegister = () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    setNameError(undefined);
    setEmailError(undefined);
    setFormError(undefined);

    let hasError = false;
    if (!trimmedName) {
      setNameError("Tell us what to call you");
      hasError = true;
    }
    if (!trimmedEmail) {
      setEmailError("Enter your email");
      hasError = true;
    }
    if (!isPasswordValid(password)) {
      hasError = true;
    }
    if (hasError) {
      return;
    }

    const submit = async () => {
      setLoading(true);
      try {
        const res = await registerUser({ email: trimmedEmail, username: trimmedName, password });
        console.log("Registration successful:", res);
        router.replace("./login");
      } catch (error) {
        console.error("Registration failed:", error);
        setFormError(parseRegisterError(error));
      } finally {
        setLoading(false);
      }
    };
    submit();
  };

  const passwordMeetsHint = isPasswordValid(password);

  const content = (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <StatusBar style="light" />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.content}>
          <BackButton />

          <View style={styles.form}>
            <Text style={styles.title}>Make it yours</Text>
            <Text style={[styles.subtitle, { marginBottom: 28 }]}>Thirty seconds, then you're shopping.</Text>

            <AuthTextField
              label="Your name"
              value={name}
              onChangeText={setName}
              returnKeyType="next"
              error={nameError}
              onSubmitEditing={() => emailRef.current?.focus()}
              style={{ marginBottom: 16 }}
            />
            <AuthTextField
              ref={emailRef}
              label="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
              error={emailError}
              onSubmitEditing={() => passwordRef.current?.focus()}
              style={{ marginBottom: 16 }}
            />
            <AuthTextField
              ref={passwordRef}
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={handleRegister}
            />

            <View style={styles.passwordHintRow}>
              <View style={[styles.passwordHintDot, !passwordMeetsHint && styles.passwordHintDotUnmet]} />
              <Text style={styles.passwordHintText}>8+ characters, at least one number</Text>
            </View>

            {formError ? <Text style={styles.formError}>{formError}</Text> : null}
          </View>

          <View style={[styles.footer, { paddingBottom: 44 + insets.bottom }]}>
            <PrimaryButton label="Create account" onPress={handleRegister} loading={loading} style={{ marginBottom: 16 }} />
            <Pressable onPress={() => router.push("./login")}>
              <Text style={styles.footerText}>
                Already have one? <Text style={styles.footerTextStrong}>Log in</Text>
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
