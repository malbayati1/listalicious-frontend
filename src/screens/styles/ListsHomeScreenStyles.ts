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
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 22,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 26,
  },
  headerDate: {
    fontFamily: fonts.outfit400,
    fontSize: 14,
    color: colors.muted,
    marginBottom: 6,
  },
  headerTitle: {
    fontFamily: fonts.outfit600,
    fontSize: 32,
    lineHeight: 35,
    letterSpacing: -0.96,
    color: colors.ink,
  },
  headerAvatarPressed: {
    opacity: 0.8,
  },

  cardList: {
    gap: 14,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 20,
    gap: 16,
  },
  cardPressed: {
    backgroundColor: colors.hover,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  cardTitle: {
    fontFamily: fonts.outfit600,
    fontSize: 21,
    letterSpacing: -0.42,
    color: colors.ink,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontFamily: fonts.outfit400,
    fontSize: 14,
    color: colors.muted,
  },
  cardFooterRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarOverlap: {
    marginLeft: -8,
  },
  avatarFirst: {
    marginLeft: 0,
  },

  newListCard: {
    height: 64,
    borderRadius: 24,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  newListCardActive: {
    borderColor: colors.mint,
  },
  newListLabel: {
    fontFamily: fonts.outfit500,
    fontSize: 15,
    color: colors.muted,
  },

  emptyState: {
    alignItems: "center",
    paddingTop: 40,
  },
  emptyIllustration: {
    width: "100%",
    height: 200,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    marginBottom: 24,
  },
  emptyTitle: {
    fontFamily: fonts.outfit600,
    fontSize: 21,
    color: colors.ink,
    marginBottom: 8,
  },
  emptyBody: {
    fontFamily: fonts.outfit400,
    fontSize: 15,
    color: colors.muted,
    textAlign: "center",
    marginBottom: 24,
    maxWidth: 280,
  },
  emptyButton: {
    width: "100%",
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

  sheetTitle: {
    fontFamily: fonts.outfit600,
    fontSize: 22,
    letterSpacing: -0.44,
    color: colors.ink,
    marginBottom: 18,
  },
  sheetInput: {
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 18,
    fontFamily: fonts.outfit500,
    fontSize: 17,
    color: colors.ink,
    marginBottom: 18,
  },
  sheetError: {
    fontFamily: fonts.outfit400,
    fontSize: 13,
    color: colors.danger,
    marginTop: -10,
    marginBottom: 16,
  },

  footerLinkRow: {
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },
  footerLinkLabel: {
    fontFamily: fonts.outfit500,
    fontSize: 14,
    color: colors.muted,
  },
  archivedRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    height: 60,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    marginBottom: 10,
  },
  archivedRowTitle: {
    flex: 1,
    minWidth: 0,
    fontFamily: fonts.outfit500,
    fontSize: 15,
    color: colors.ink,
  },
  unarchivePill: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: colors.mintWash,
    alignItems: "center",
    justifyContent: "center",
  },
  unarchivePillLabel: {
    fontFamily: fonts.outfit500,
    fontSize: 13,
    color: colors.mint,
  },
  archivedEmptyText: {
    fontFamily: fonts.outfit400,
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
    paddingVertical: 20,
  },
});

export default styles;
