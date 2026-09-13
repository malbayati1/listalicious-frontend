import React from "react";
import Svg, { Path } from "react-native-svg";
import { colors } from "@/src/theme/tokens";

type Props = {
  size?: number;
  color?: string;
};

export default function ArrowRightIcon({ size = 18, color = colors.mint }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 12h14M13 6l6 6-6 6" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
