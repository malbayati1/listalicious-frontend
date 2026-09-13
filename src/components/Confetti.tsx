import React, { useEffect, useState } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { colors } from "@/src/theme/tokens";

const PARTICLE_COUNT = 28;
const PALETTE = [colors.mint, colors.apricot, colors.periwinkle, "#FFFFFF"];

type ParticleConfig = {
  id: number;
  left: number;
  color: string;
  width: number;
  height: number;
  delay: number;
  duration: number;
  rotateStart: number;
  rotateEnd: number;
  drift: number;
};

function makeParticles(): ParticleConfig[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, id) => ({
    id,
    left: Math.random() * 100,
    color: PALETTE[id % PALETTE.length],
    width: 6 + Math.random() * 5,
    height: 10 + Math.random() * 6,
    delay: Math.random() * 220,
    duration: 1500 + Math.random() * 700,
    rotateStart: Math.random() * 360,
    rotateEnd: Math.random() * 720 - 360,
    drift: (Math.random() - 0.5) * 90,
  }));
}

function ConfettiParticle({ config, fallDistance }: { config: ParticleConfig; fallDistance: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      config.delay,
      withTiming(1, { duration: config.duration, easing: Easing.out(Easing.quad) })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => {
    const translateY = progress.value * fallDistance;
    const translateX = progress.value * config.drift;
    const rotate = config.rotateStart + progress.value * config.rotateEnd;
    const opacity = progress.value < 0.85 ? 1 : 1 - (progress.value - 0.85) / 0.15;
    return {
      opacity,
      transform: [{ translateY }, { translateX }, { rotate: `${rotate}deg` }],
    };
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: `${config.left}%`,
          width: config.width,
          height: config.height,
          backgroundColor: config.color,
        },
        style,
      ]}
    />
  );
}

type Props = {
  trigger: number;
};

export default function Confetti({ trigger }: Props) {
  const { height } = useWindowDimensions();
  const [particles, setParticles] = useState<ParticleConfig[] | null>(null);

  useEffect(() => {
    if (trigger <= 0) {
      return;
    }
    setParticles(makeParticles());
    const timeout = setTimeout(() => setParticles(null), 2600);
    return () => clearTimeout(timeout);
  }, [trigger]);

  if (!particles) {
    return null;
  }

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {particles.map((particle) => (
        <ConfettiParticle key={`${trigger}-${particle.id}`} config={particle} fallDistance={height + 40} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  particle: {
    position: "absolute",
    top: -20,
    borderRadius: 2,
  },
});
