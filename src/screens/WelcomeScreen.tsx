import React from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import styles from "./styles/WelcomeScreenStyles";

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar style="light" />
      <View style={[styles.content, { paddingBottom: 48 + insets.bottom }]}>
        <View style={styles.hero}>
          <View style={styles.swatchRow}>
            <View style={[styles.swatch, styles.swatchMint]} />
            <View style={[styles.swatch, styles.swatchApricot]} />
            <View style={[styles.swatch, styles.swatchNeutral]} />
          </View>
          <Text style={styles.title}>Listalicious</Text>
          <Text style={styles.subtitle}>One list. Everyone in the house. Watch it empty in real time.</Text>
        </View>

        <View style={styles.buttons}>
          <Pressable
            onPress={() => router.push("./register")}
            style={({ pressed }) => [styles.buttonPrimary, pressed && styles.buttonPrimaryPressed]}
          >
            <Text style={styles.buttonPrimaryLabel}>Start a list</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("./login")}
            style={({ pressed }) => [styles.buttonSecondary, pressed && styles.buttonSecondaryPressed]}
          >
            <Text style={styles.buttonSecondaryLabel}>I already have an account</Text>
          </Pressable>

          <Pressable onPress={() => router.push("./login")} style={styles.buttonText}>
            <Text style={styles.buttonTextLabel}>Someone sent me an invite link</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
