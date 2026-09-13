import React from "react";
import Svg, { Circle, Path } from "react-native-svg";
import { colors } from "@/src/theme/tokens";

type Props = {
  size?: number;
  color?: string;
};

export default function ClockIcon({ size = 18, color = colors.ink }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={2.2} />
      <Path d="M12 7v5l3.5 2" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
