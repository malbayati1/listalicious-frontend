import React from "react";
import Svg, { Path } from "react-native-svg";
import { colors } from "@/src/theme/tokens";

type Props = {
  size?: number;
  color?: string;
};

export default function ChevronDownIcon({ size = 18, color = colors.ink }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 9l6 6 6-6" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
