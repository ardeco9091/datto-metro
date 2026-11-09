"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { buildMetroResult, careers } from "../../lib/metro";
import type { SavedMetroTicket } from "../../lib/metro";
import { decodeTicket } from "../../lib/ticket-share";
import { MetroTicket } from "../../components/MetroTicket";

export default function TicketPreviewPage() {
  const router = useRouter();
  const [data, setData] = useState<SavedMetroTicket | null>(null);
  const [pending, setPending] = useState<SavedMetroTicket | null>(null);
  const [freeHalves, setFreeHalves] = useState(0);
  const [shared, setShared] = useState(false);
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("ticket");
      if (token) {
        const ticket = decodeTicket(token);
        if (!ticket || !careers.some(career => career.id === ticket.c)) { router.replace("/dattometro"); return; }
        setShared(true);
        setData({ name: ticket.n, answers: ticket.a, selectedCourseId: ticket.c, result: buildMetroResult(ticket.a) });
        return;
      }
      const raw = sessionStorage.getItem("dattoMetroResult");
      if (!raw) { router.replace("/dattometro"); return; }
      const saved = JSON.parse(raw) as SavedMetroTicket;
      if (!saved.name || !saved.result?.lineScores) { router.replace("/dattometro"); return; }
      setData(saved);
      const available = Number(sessionStorage.getItem("dattoMetroFreeHalves") || "0");
      setFreeHalves(Number.isFinite(available) ? Math.max(0, Math.floor(available)) : 0);
      if (params.get("prepare") === "1") {
        const queued = sessionStorage.getItem("dattoMetroPrintQueue");
        if (queued) {
          const parsed = JSON.parse(queued) as SavedMetroTicket[];
          if (Array.isArray(parsed) && parsed.length) setPending(parsed[parsed.length - 1]);
        }
      }
    } catch { router.replace("/dattometro"); }
  }, [router]);

  function openPrintSheet(tickets: SavedMetroTicket[], position: "top" | "bottom" = "top") {
    sessionStorage.setItem("dattoMetroPrintJob", JSON.stringify({ tickets, position }));
    router.push("/dattometro-sheet");
  }
  function addAndContinue() {
    if (!data) return;
    sessionStorage.setItem("dattoMetroPrintQueue", JSON.stringify([data]));
    sessionStorage.removeItem("dattoMetroResult");
    router.push("/dattometro");
  }

  if (!data) return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", color: "#717b72", background: "#f4f4ef", fontFamily: "Arial,sans-serif" }}>Preparando tus tarjetas…</main>;
  const button: React.CSSProperties = { minHeight: 44, padding: "0 15px", border: "1px solid #dfe3dc", borderRadius: 4, background: "#fff", color: "#344331", fontSize: 10, fontWeight: 700, cursor: "pointer" };

  if (shared) return <main style={{ minHeight: "100vh", display: "grid", alignContent: "center", justifyItems: "center", gap: 12, boxSizing: "border-box", padding: 22, background: "#e9ebe4", color: "#17211a", fontFamily: "Arial,sans-serif" }}><div style={{ width: "min(100%,740px)", color: "#657260", fontFamily: "monospace", fontSize: 9, letterSpacing: 1 }}>TARJETA DIGITAL · PODÉS GUARDAR ESTA PANTALLA COMO CAPTURA</div><MetroTicket data={data} /></main>;

  return <main style={{ minHeight: "100vh", display: "grid", alignContent: "center", justifyItems: "center", gap: 14, boxSizing: "border-box", padding: 24, background: "#e9ebe4", color: "#17211a", fontFamily: "Arial,sans-serif" }}><section style={{ width: "min(100%,740px)", display: "flex", justifyContent: "space-between", alignItems: "end", gap: 12, flexWrap: "wrap" }}><div><div style={{ color: "#678244", fontFamily: "monospace", fontSize: 9, letterSpacing: 1.3 }}>PREPARAR IMPRESIÓN</div><h1 style={{ margin: "6px 0 0", fontSize: 24, letterSpacing: -.7 }}>Dos tarjetas por hoja</h1><p style={{ margin: "5px 0 0", color: "#717b72", fontSize: 10 }}>Cada tarjeta ocupa media hoja A4.</p></div><button onClick={() => router.push("/dattometro-result")} style={button}>Volver al resultado</button></section>
    {pending && <div style={{ width: "min(100%,740px)", padding: "11px 13px", border: "1px solid #d8dfcf", borderLeft: "3px solid #8aa840", borderRadius: 4, background: "#f8faf5", color: "#586653", fontSize: 10, lineHeight: 1.5 }}>Hoja completa: <strong>{pending.name}</strong> + <strong>{data.name}</strong>. Al imprimir, salen juntas en una hoja.</div>}
    {!pending && freeHalves > 0 && <div style={{ width: "min(100%,740px)", padding: "11px 13px", border: "1px solid #d8dfcf", borderLeft: "3px solid #8aa840", borderRadius: 4, background: "#f8faf5", color: "#586653", fontSize: 10, lineHeight: 1.55 }}>Tenés {freeHalves === 1 ? "una hoja con la mitad inferior libre" : `${freeHalves} hojas con una mitad libre`}. Reinsertá una de esas hojas y elegí <strong>Completar mitad libre</strong>; esta tarjeta se imprimirá abajo. La orientación de carga cambia según la impresora: probá primero con una hoja común.</div>}
    <MetroTicket data={data} />
    <div style={{ width: "min(100%,740px)", display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "flex-end" }}>{pending ? <><button onClick={() => openPrintSheet([pending, data])} style={{ ...button, flex: "1 1 230px", background: "#c5f36a", borderColor: "#c5f36a", color: "#172017" }}>Imprimir las dos tarjetas</button><button onClick={() => { sessionStorage.removeItem("dattoMetroPrintQueue"); openPrintSheet([data]); }} style={button}>Imprimir solo esta</button></> : <><button onClick={addAndContinue} style={{ ...button, flex: "1 1 230px", background: "#c5f36a", borderColor: "#c5f36a", color: "#172017" }}>Guardar y sumar otro pasajero</button>{freeHalves > 0 && <button onClick={() => openPrintSheet([data], "bottom")} style={{ ...button, background: "#edf4df", borderColor: "#b8cc8f" }}>Completar mitad libre</button>}<button onClick={() => openPrintSheet([data])} style={button}>{freeHalves > 0 ? "Imprimir en hoja nueva" : "Imprimir esta en media hoja"}</button></>}</div>
    {!pending && <p style={{ width: "min(100%,740px)", margin: 0, color: "#879184", textAlign: "right", fontSize: 9 }}>Si imprimís solo una, queda registrada una mitad libre para el próximo pasajero de esta sesión.</p>}
  </main>;
}
