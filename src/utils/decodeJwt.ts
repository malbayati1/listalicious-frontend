// Minimal JWT payload decode — no signature verification, just reads the
// claims (e.g. `jti`) already trusted because the token came from our own
// storage. Avoids pulling in a whole JWT library for one field.
export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const payloadSegment = token.split(".")[1];
    if (!payloadSegment) {
      return null;
    }
    const base64 = payloadSegment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const json = typeof atob !== "undefined" ? atob(padded) : Buffer.from(padded, "base64").toString("utf-8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}
