"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { SavedMetroTicket } from "../../lib/metro";
import { MetroTicket } from "../../components/MetroTicket";

export default function PrintSheetPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<SavedMetroTicket[] | null>(null);
  const [position, setPosition] = useState<"top" | "bottom">("top");
  const printed = useRef(false);
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("dattoMetroPrintJob");
      const parsed = raw ? JSON.parse(raw) as SavedMetroTicket[] | { tickets: SavedMetroTicket[]; position?: "top" | "bottom" } : [];
      const list = Array.isArray(parsed) ? parsed : parsed.tickets;
      const placement = Array.isArray(parsed) ? "top" : parsed.position === "bottom" ? "bottom" : "top";
      if (!Array.isArray(list) || list.length < 1 || list.length > 2 || list.some(ticket => !ticket?.name || !ticket?.result?.lineScores) || (placement === "bottom" && list.length !== 1)) { router.replace("/dattometro-result"); return; }
      setPosition(placement);
      setTickets(list);
    } catch { router.replace("/dattometro-result"); }
  }, [router]);

  useEffect(() => {
    if (!tickets || printed.current) return;
    printed.current = true;
    const afterPrint = () => {
      const available = Number(sessionStorage.getItem("dattoMetroFreeHalves") || "0");
      if (tickets.length === 1 && position === "top") sessionStorage.setItem("dattoMetroFreeHalves", String(Math.max(0, Math.floor(available)) + 1));
      if (tickets.length === 1 && position === "bottom") sessionStorage.setItem("dattoMetroFreeHalves", String(Math.max(0, Math.floor(available) - 1)));
      sessionStorage.removeItem("dattoMetroPrintJob");
      sessionStorage.removeItem("dattoMetroPrintQueue");
      router.replace("/dattometro-result");
    };
    window.addEventListener("afterprint", afterPrint, { once: true });
    const timer = window.setTimeout(() => window.print(), 550);
    return () => { window.clearTimeout(timer); window.removeEventListener("afterprint", afterPrint); };
  }, [tickets, position, router]);

  if (!tickets) return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#fff", color: "#657260", fontFamily: "Arial,sans-serif" }}>Armando la hoja…</main>;
  return <main aria-label={`${tickets.length} tarjeta${tickets.length === 1 ? "" : "s"} para imprimir`} style={{ width: "min(100%,190mm)", height: "270mm", minHeight: "270mm", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "stretch", gap: "6mm", margin: "0 auto", padding: 0, background: "#fff", color: "#17211a", fontFamily: "Arial,sans-serif" }}>
    {tickets.length === 1 && position === "bottom" && <div aria-hidden="true" style={{ height: "138mm", flex: "0 0 138mm" }} />}
    {tickets.map((ticket, index) => <MetroTicket key={`${ticket.name}-${index}`} data={ticket} compact />)}
  </main>;
}
