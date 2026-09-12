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
    justifyContent: "flex-end",
  },
  hero: {
    justifyContent: "flex-end",
    paddingBottom: 36,
  },
  swatchRow: {
    flexDirection: "row",
    gap: 7,
    marginBottom: 26,
  },
  swatch: {
    width: 14,
    height: 14,
    borderRadius: 4,
  },
  swatchMint: {
    backgroundColor: colors.mint,
  },
  swatchApricot: {
    backgroundColor: colors.apricot,
  },
  swatchNeutral: {
    backgroundColor: colors.swatchNeutral,
  },
  title: {
    fontFamily: fonts.outfit600,
    fontSize: 54,
    lineHeight: 53,
    letterSpacing: -1.89,
    color: colors.ink,
  },
  subtitle: {
    fontFamily: fonts.outfit400,
    fontSize: 18,
    lineHeight: 26,
    color: colors.muted,
    marginTop: 16,
    maxWidth: 290,
  },
  buttons: {
    flexDirection: "column",
    gap: 12,
  },
  buttonPrimary: {
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.mint,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPrimaryPressed: {
    backgroundColor: "#7BEDB9",
  },
  buttonPrimaryLabel: {
    fontFamily: fonts.outfit600,
    fontSize: 17,
    color: colors.mintInk,
  },
  buttonSecondary: {
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonSecondaryPressed: {
    backgroundColor: colors.hover,
  },
  buttonSecondaryLabel: {
    fontFamily: fonts.outfit500,
    fontSize: 17,
    color: colors.ink,
  },
  buttonText: {
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonTextLabel: {
    fontFamily: fonts.outfit400,
    fontSize: 14,
    color: colors.faint,
  },
});

export default styles;
