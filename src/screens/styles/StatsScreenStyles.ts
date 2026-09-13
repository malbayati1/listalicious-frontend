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
    paddingBottom: 18,
  },
  title: {
    fontFamily: fonts.outfit600,
    fontSize: 30,
    lineHeight: 32,
    letterSpacing: -0.9,
    color: colors.ink,
    marginTop: 14,
  },

  scrollContent: {
    paddingHorizontal: 22,
  },

  card: {
    padding: 22,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: 14,
  },

  heroCard: {
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 22,
  },
  heroTextBlock: {
    flex: 1,
    minWidth: 0,
  },
  heroHeadline: {
    fontFamily: fonts.outfit600,
    fontSize: 19,
    letterSpacing: -0.38,
    color: colors.ink,
  },
  heroSub: {
    fontFamily: fonts.outfit400,
    fontSize: 14,
    lineHeight: 21,
    color: colors.muted,
    marginTop: 6,
  },

  tileRow: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 14,
  },
  tile: {
    flex: 1,
    padding: 20,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  tileValue: {
    fontFamily: fonts.mono500,
    fontSize: 30,
  },
  tileLabel: {
    fontFamily: fonts.outfit400,
    fontSize: 13,
    color: colors.muted,
    marginTop: 4,
  },

  sectionLabel: {
    fontFamily: fonts.mono500,
    fontSize: 11,
    letterSpacing: 1.1,
    color: colors.muted,
    marginBottom: 18,
  },

  chartRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    height: 92,
  },
  chartBarColumn: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  chartBar: {
    width: "100%",
    borderRadius: 7,
    backgroundColor: "#2A3138",
  },
  chartBarLabel: {
    fontFamily: fonts.mono400,
    fontSize: 10.5,
    color: colors.faint,
  },
  chartBarLabelToday: {
    color: colors.ink,
  },

  contributionRow: {
    marginBottom: 14,
  },
  contributionTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  contributionAvatar: {
    width: 30,
    height: 30,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  contributionAvatarLabel: {
    fontFamily: fonts.outfit600,
    fontSize: 13,
    color: colors.mintInk,
  },
  contributionInfo: {
    flex: 1,
    minWidth: 0,
  },
  contributionTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  contributionName: {
    fontFamily: fonts.outfit500,
    fontSize: 14,
    color: colors.ink,
  },
  contributionCount: {
    fontFamily: fonts.mono400,
    fontSize: 12,
    color: colors.muted,
  },
  contributionTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.chip,
    overflow: "hidden",
  },
  contributionFill: {
    height: "100%",
    borderRadius: 3,
  },

  emptyNote: {
    fontFamily: fonts.outfit400,
    fontSize: 14,
    color: colors.muted,
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
