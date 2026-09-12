import { StyleSheet } from "react-native";
import { colors, fonts } from "@/src/theme/tokens";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    width: "100%",
    maxWidth: 440,
    alignSelf: "center",
    paddingHorizontal: 28,
    paddingTop: 76,
  },
  form: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontFamily: fonts.outfit600,
    fontSize: 36,
    lineHeight: 38,
    letterSpacing: -1.08,
    color: colors.ink,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: fonts.outfit400,
    fontSize: 15,
    color: colors.muted,
  },
  forgotPassword: {
    fontFamily: fonts.outfit400,
    fontSize: 14,
    color: colors.mint,
    marginTop: 16,
  },
  passwordHintRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 14,
  },
  passwordHintDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.mint,
  },
  passwordHintDotUnmet: {
    backgroundColor: colors.danger,
  },
  passwordHintText: {
    fontFamily: fonts.outfit400,
    fontSize: 13,
    color: colors.muted,
  },
  formError: {
    fontFamily: fonts.outfit400,
    fontSize: 13,
    color: colors.danger,
    marginTop: 16,
  },
  footer: {
    paddingBottom: 44,
  },
  footerText: {
    fontFamily: fonts.outfit400,
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
  },
  footerTextStrong: {
    fontFamily: fonts.outfit500,
    color: colors.ink,
  },
});

export default styles;
