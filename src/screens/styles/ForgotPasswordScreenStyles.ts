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
  body: {
    flex: 1,
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
  title: {
    fontFamily: fonts.outfit600,
    fontSize: 32,
    lineHeight: 35,
    letterSpacing: -0.96,
    color: colors.ink,
    marginBottom: 8,
  },
  body1: {
    fontFamily: fonts.outfit400,
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
  },
  devNoteCard: {
    marginTop: 22,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  devNoteLabel: {
    fontFamily: fonts.mono500,
    fontSize: 11,
    letterSpacing: 0.66,
    color: colors.apricot,
    marginBottom: 6,
  },
  devNoteBody: {
    fontFamily: fonts.outfit400,
    fontSize: 13.5,
    lineHeight: 19,
    color: colors.inkBody,
  },
  fieldLabel: {
    fontFamily: fonts.mono500,
    fontSize: 12,
    letterSpacing: 0.72,
    textTransform: "uppercase",
    color: colors.muted,
    marginTop: 22,
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    paddingHorizontal: 18,
    fontFamily: fonts.outfit400,
    fontSize: 15,
    color: colors.ink,
  },
  error: {
    fontFamily: fonts.outfit400,
    fontSize: 13,
    color: colors.danger,
    marginTop: 8,
  },
  success: {
    fontFamily: fonts.outfit400,
    fontSize: 13,
    color: colors.mint,
    marginTop: 8,
  },
  footer: {
    paddingBottom: 44,
  },
  linkButton: {
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  linkButtonLabel: {
    fontFamily: fonts.outfit400,
    fontSize: 14,
    color: colors.mint,
  },
});

export default styles;
