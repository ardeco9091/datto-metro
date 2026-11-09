export type SharedTicket = { n: string; c: string; a: number[] };

export function encodeTicket(ticket: SharedTicket): string {
  const bytes = new TextEncoder().encode(JSON.stringify(ticket));
  let binary = "";
  bytes.forEach(byte => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function decodeTicket(token: string): SharedTicket | null {
  try {
    const base64 = token.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(base64 + "=".repeat((4 - base64.length % 4) % 4));
    const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
    const parsed = JSON.parse(new TextDecoder().decode(bytes)) as Partial<SharedTicket>;
    if (typeof parsed.n !== "string" || typeof parsed.c !== "string" || !Array.isArray(parsed.a) || parsed.a.length !== 5 || parsed.a.some(answer => !Number.isInteger(answer) || answer < 0 || answer > 3)) return null;
    return { n: parsed.n.slice(0, 32), c: parsed.c, a: parsed.a };
  } catch {
    return null;
  }
}
