import { StyleSheet } from "react-native";
import { colors, fonts } from "@/src/theme/tokens";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    paddingHorizontal: 22,
    paddingBottom: 8,
  },

  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 8,
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 26,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: colors.mint,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLabel: {
    fontFamily: fonts.outfit600,
    fontSize: 26,
    color: colors.mintInk,
  },
  name: {
    fontFamily: fonts.outfit600,
    fontSize: 24,
    letterSpacing: -0.48,
    color: colors.ink,
  },
  email: {
    fontFamily: fonts.mono400,
    fontSize: 13.5,
    color: colors.muted,
    marginTop: 3,
  },
  verifiedPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 99,
    backgroundColor: colors.mintWash,
  },
  verifiedPillUnverified: {
    backgroundColor: "rgba(255,192,143,0.12)",
  },
  verifiedDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.mint,
  },
  verifiedDotUnverified: {
    backgroundColor: colors.apricot,
  },
  verifiedLabel: {
    fontFamily: fonts.outfit500,
    fontSize: 11.5,
    color: colors.mint,
  },
  verifiedLabelUnverified: {
    color: colors.apricot,
  },

  settingsList: {
    gap: 8,
    marginBottom: 22,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  settingRowPressed: {
    backgroundColor: colors.hover,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontFamily: fonts.outfit500,
    fontSize: 16,
    color: colors.ink,
  },
  settingMeta: {
    fontFamily: fonts.outfit400,
    fontSize: 12.5,
    color: colors.muted,
    marginTop: 2,
  },
  toggleTrack: {
    width: 48,
    height: 28,
    borderRadius: 99,
    padding: 3,
    flexDirection: "row",
  },
  toggleTrackOn: {
    backgroundColor: colors.mint,
    justifyContent: "flex-end",
  },
  toggleTrackOff: {
    backgroundColor: "#2A3138",
    justifyContent: "flex-start",
  },
  toggleKnob: {
    width: 22,
    height: 22,
    borderRadius: 99,
  },

  logoutButton: {
    height: 52,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutButtonPressed: {
    borderColor: "rgba(255,138,128,0.4)",
  },
  logoutLabel: {
    fontFamily: fonts.outfit500,
    fontSize: 15,
    color: colors.danger,
  },

  footer: {
    textAlign: "center",
    fontFamily: fonts.mono400,
    fontSize: 11,
    color: colors.disabledStrong,
    marginTop: 18,
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
    lineHeight: 21,
    color: colors.muted,
    marginBottom: 18,
  },
  fieldLabel: {
    fontFamily: fonts.mono500,
    fontSize: 12,
    letterSpacing: 0.72,
    textTransform: "uppercase",
    color: colors.muted,
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
    marginBottom: 16,
  },
  devNoteCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: 16,
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
  error: {
    fontFamily: fonts.outfit400,
    fontSize: 13,
    color: colors.danger,
    marginTop: -8,
    marginBottom: 16,
  },
  success: {
    fontFamily: fonts.outfit400,
    fontSize: 13,
    color: colors.mint,
    marginTop: 8,
  },
  sheetCancel: {
    height: 52,
    borderRadius: 18,
    backgroundColor: colors.surfaceRaised,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  sheetCancelLabel: {
    fontFamily: fonts.outfit500,
    fontSize: 15,
    color: colors.ink,
  },
  sheetDangerButton: {
    height: 52,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  sheetDangerLabel: {
    fontFamily: fonts.outfit500,
    fontSize: 15,
    color: colors.danger,
  },
});

export default styles;
