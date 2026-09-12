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
  centerFill: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: colors.mintWash,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 26,
  },
  headline: {
    fontFamily: fonts.outfit600,
    fontSize: 32,
    lineHeight: 35,
    letterSpacing: -0.96,
    color: colors.ink,
    textAlign: "center",
    maxWidth: 300,
  },
  headlineBody: {
    fontFamily: fonts.outfit400,
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
    textAlign: "center",
    marginTop: 14,
    maxWidth: 280,
  },
  tokenCard: {
    marginTop: 26,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  tokenCardError: {
    borderColor: "rgba(255,158,138,0.4)",
  },
  tokenLabel: {
    fontFamily: fonts.mono500,
    fontSize: 11,
    letterSpacing: 0.66,
    color: colors.muted,
  },
  tokenValue: {
    fontFamily: fonts.mono400,
    fontSize: 12,
    color: colors.faint,
  },
  tokenError: {
    fontFamily: fonts.mono400,
    fontSize: 12,
    color: colors.danger,
  },
  footer: {
    paddingBottom: 44,
  },
  notNow: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  notNowLabel: {
    fontFamily: fonts.outfit400,
    fontSize: 15,
    color: colors.muted,
  },
});

export default styles;
