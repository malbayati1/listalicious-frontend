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
  subtitle: {
    fontFamily: fonts.outfit400,
    fontSize: 15,
    color: colors.muted,
    marginTop: 6,
  },

  scrollContent: {
    paddingHorizontal: 22,
  },

  inviteCard: {
    padding: 18,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: 22,
  },
  inviteCardPressed: {
    backgroundColor: colors.hover,
  },
  inviteTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  inviteLabel: {
    fontFamily: fonts.outfit500,
    fontSize: 15,
    color: colors.ink,
  },
  inviteUrl: {
    fontFamily: fonts.mono400,
    fontSize: 12.5,
    color: colors.faint,
    marginTop: 5,
  },
  copyPill: {
    height: 38,
    paddingHorizontal: 16,
    borderRadius: 13,
    backgroundColor: colors.mint,
    alignItems: "center",
    justifyContent: "center",
  },
  copyPillLabel: {
    fontFamily: fonts.outfit600,
    fontSize: 14,
    color: colors.mintInk,
  },
  inviteExpiry: {
    fontFamily: fonts.mono400,
    fontSize: 12,
    color: colors.apricot,
    marginTop: 12,
  },
  inviteError: {
    fontFamily: fonts.outfit400,
    fontSize: 13,
    color: colors.danger,
    marginTop: 12,
  },

  sectionLabel: {
    fontFamily: fonts.mono500,
    fontSize: 11,
    letterSpacing: 1.1,
    color: colors.muted,
    marginBottom: 12,
  },
  collaboratorList: {
    gap: 8,
    marginBottom: 22,
  },
  collaboratorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  collaboratorRowPressed: {
    backgroundColor: colors.hover,
  },
  collaboratorInfo: {
    flex: 1,
    minWidth: 0,
  },
  collaboratorName: {
    fontFamily: fonts.outfit500,
    fontSize: 16,
    color: colors.ink,
  },
  collaboratorMeta: {
    fontFamily: fonts.outfit400,
    fontSize: 12.5,
    color: colors.muted,
    marginTop: 2,
  },
  collaboratorRole: {
    fontFamily: fonts.mono400,
    fontSize: 12,
    color: colors.disabledStrong,
  },

  addByEmailRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
  },
  emailInput: {
    flex: 1,
    minWidth: 0,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    paddingHorizontal: 16,
    fontFamily: fonts.outfit400,
    fontSize: 15,
    color: colors.ink,
  },
  addByEmailButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.chip,
    alignItems: "center",
    justifyContent: "center",
  },
  addByEmailButtonPressed: {
    backgroundColor: "#2C333B",
  },
  addByEmailError: {
    fontFamily: fonts.outfit400,
    fontSize: 13,
    color: colors.danger,
    marginBottom: 8,
  },

  searchStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  },
  searchStatusLabel: {
    fontFamily: fonts.outfit400,
    fontSize: 13,
    color: colors.muted,
  },
  searchResultsList: {
    marginTop: 4,
    gap: 6,
  },
  searchResultRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.line,
  },
  searchResultRowPressed: {
    backgroundColor: colors.hover,
  },
  searchResultAdd: {
    fontFamily: fonts.outfit500,
    fontSize: 13,
    color: colors.mint,
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
    marginBottom: 8,
  },
  sheetBody: {
    fontFamily: fonts.outfit400,
    fontSize: 15,
    color: colors.muted,
    marginBottom: 22,
  },
  removeConfirm: {
    height: 52,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  removeConfirmLabel: {
    fontFamily: fonts.outfit500,
    fontSize: 15,
    color: colors.danger,
  },
  removeCancel: {
    height: 52,
    borderRadius: 18,
    backgroundColor: colors.surfaceRaised,
    alignItems: "center",
    justifyContent: "center",
  },
  removeCancelLabel: {
    fontFamily: fonts.outfit500,
    fontSize: 15,
    color: colors.ink,
  },
});

export default styles;
