import { StyleSheet } from "react-native";
import { colors, fonts } from "@/src/theme/tokens";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  centerFill: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    paddingHorizontal: 22,
    paddingBottom: 16,
  },
  title: {
    fontFamily: fonts.outfit600,
    fontSize: 32,
    lineHeight: 34,
    letterSpacing: -0.96,
    color: colors.ink,
  },
  subtitle: {
    fontFamily: fonts.outfit400,
    fontSize: 14,
    color: colors.muted,
    marginTop: 4,
  },

  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 8,
  },

  row: {
    flexDirection: "row",
    gap: 14,
  },
  railColumn: {
    width: 32,
    flexShrink: 0,
    alignItems: "center",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLabel: {
    fontFamily: fonts.outfit600,
    fontSize: 13,
  },
  connector: {
    flex: 1,
    width: 2,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginVertical: 6,
  },
  entryBody: {
    flex: 1,
    paddingBottom: 20,
  },
  sentence: {
    fontFamily: fonts.outfit400,
    fontSize: 15,
    lineHeight: 21,
    color: colors.inkBody,
  },
  actor: {
    fontFamily: fonts.outfit600,
    color: colors.ink,
  },
  object: {
    fontFamily: fonts.outfit500,
    color: colors.mint,
  },
  meta: {
    fontFamily: fonts.mono400,
    fontSize: 12,
    color: colors.faint,
    marginTop: 5,
  },

  emptyState: {
    alignItems: "center",
    paddingTop: 60,
  },
  emptyText: {
    fontFamily: fonts.outfit400,
    fontSize: 15,
    color: colors.muted,
    textAlign: "center",
    maxWidth: 260,
  },

  errorTitle: {
    fontFamily: fonts.outfit600,
    fontSize: 21,
    color: colors.ink,
    marginBottom: 8,
    textAlign: "center",
  },
  errorBody: {
    fontFamily: fonts.outfit400,
    fontSize: 15,
    color: colors.muted,
    textAlign: "center",
    marginBottom: 24,
    maxWidth: 280,
  },
});

export default styles;
