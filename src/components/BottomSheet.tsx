import React, { useEffect, useRef } from "react";
import { Animated, Easing, Modal, Platform, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/src/theme/tokens";

type Props = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function BottomSheet({ visible, onClose, children }: Props) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(320)).current;

  useEffect(() => {
    if (visible) {
      translateY.setValue(320);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: Platform.OS !== "web",
      }).start();
    }
  }, [visible, translateY]);

  if (!visible) {
    return null;
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.scrim} onPress={onClose} />
      <Animated.View
        style={[styles.sheet, { paddingBottom: 24 + insets.bottom, transform: [{ translateY }] }]}
      >
        <View style={styles.grabber} />
        {children}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(6,8,10,0.6)",
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.sheet,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 14,
    paddingHorizontal: 22,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.09)",
  },
  grabber: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#2F353C",
    marginBottom: 18,
  },
});
