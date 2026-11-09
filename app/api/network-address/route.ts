import { networkInterfaces } from "node:os";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const interfaces = Object.entries(networkInterfaces()).flatMap(([name, entries]) => (entries || [])
    .filter(entry => entry.family === "IPv4" && !entry.internal)
    .map(entry => ({ name, address: entry.address })));
  const privateInterfaces = interfaces.filter(({ address }) => /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(address));
  const wifi = privateInterfaces.find(({ name }) => /wi[ -]?fi|wireless|wlan/i.test(name));
  const chosen = wifi || privateInterfaces.find(({ address }) => !address.startsWith("192.168.56.")) || interfaces[0];
  return NextResponse.json({ address: chosen?.address || null, port: process.env.PORT || "3300" }, { headers: { "Cache-Control": "no-store" } });
}
