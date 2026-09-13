import { StyleSheet } from "react-native";
import { colors, fonts } from "@/src/theme/tokens";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
    width: "100%",
    maxWidth: 440,
    alignSelf: "center",
    paddingHorizontal: 28,
    paddingTop: 76,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dots: {
    flexDirection: "row",
    gap: 6,
  },
  dot: {
    width: 26,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#2A3138",
  },
  dotActive: {
    backgroundColor: colors.mint,
  },
  skipLabel: {
    fontFamily: fonts.outfit500,
    fontSize: 14,
    color: colors.muted,
  },
  body: {
    flex: 1,
    justifyContent: "center",
    gap: 30,
  },
  illustration: {
    height: 230,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  illustrationLabel: {
    fontFamily: fonts.mono400,
    fontSize: 11,
    letterSpacing: 0.66,
    color: colors.faint,
    textAlign: "center",
  },
  headline: {
    fontFamily: fonts.outfit600,
    fontSize: 34,
    lineHeight: 37,
    letterSpacing: -1.02,
    color: colors.ink,
  },
  headlineBody: {
    fontFamily: fonts.outfit400,
    fontSize: 16,
    lineHeight: 24,
    color: colors.muted,
    marginTop: 14,
  },
  footer: {
    paddingBottom: 44,
  },
});

export default styles;
