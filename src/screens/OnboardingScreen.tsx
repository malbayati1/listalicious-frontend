import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import PrimaryButton from "../components/PrimaryButton";
import styles from "./styles/OnboardingScreenStyles";

const STEPS = [
  {
    illustration: "illustration — two phones, one list",
    headline: "Everyone shops off the same list",
    body: "Ticks land instantly. No more two people buying the same bag of spinach.",
  },
  {
    illustration: "illustration — live presence banner",
    headline: "See who's shopping right now",
    body: "A quick banner shows when someone's in the aisles, ticking things off live.",
  },
  {
    illustration: "illustration — items ticking off",
    headline: "Nothing falls through the cracks",
    body: "Add it once. Everyone sees it, checks it off, and the list empties together.",
  },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const isLastStep = step === STEPS.length - 1;
  const current = STEPS[step];

  const goToSignUp = () => router.push("./register");

  const handleNext = () => {
    if (isLastStep) {
      goToSignUp();
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.dots}>
            {STEPS.map((_, index) => (
              <View key={index} style={[styles.dot, index === step && styles.dotActive]} />
            ))}
          </View>
          <Pressable onPress={goToSignUp}>
            <Text style={styles.skipLabel}>Skip</Text>
          </Pressable>
        </View>

        <View style={styles.body}>
          <View style={styles.illustration}>
            <Text style={styles.illustrationLabel}>{current.illustration}</Text>
          </View>
          <View>
            <Text style={styles.headline}>{current.headline}</Text>
            <Text style={styles.headlineBody}>{current.body}</Text>
          </View>
        </View>

        <View style={[styles.footer, { paddingBottom: 44 + insets.bottom }]}>
          <PrimaryButton label={isLastStep ? "Get started" : "Next"} onPress={handleNext} />
        </View>
      </View>
    </SafeAreaView>
  );
}
