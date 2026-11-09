"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { careers, getCareer, getTopCareers, lines, type LineId, type MetroResult } from "../../lib/metro";
import { encodeTicket } from "../../lib/ticket-share";

type Saved = { name: string; answers: number[]; result: MetroResult; selectedCourseId?: string; createdAt?: string };
const ink = "#17211a";
const muted = "#788178";
const lime = "#c5f36a";
const card: React.CSSProperties = { border: "1px solid #e5e7e1", borderRadius: 8, background: "#fff", boxShadow: "0 12px 38px rgba(34,48,33,.045)" };

export default function ResultPage() {
  const router = useRouter();
  const [data, setData] = useState<Saved | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [shareOpen, setShareOpen] = useState(false);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrData, setQrData] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [qrError, setQrError] = useState("");
  const [qrUsesLan, setQrUsesLan] = useState(false);
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("dattoMetroResult");
      if (!raw) { router.replace("/dattometro"); return; }
      const saved = JSON.parse(raw) as Saved;
      if (!saved.name || !saved.result?.ranking?.length) { router.replace("/dattometro"); return; }
      setData(saved);
      setSelectedCourseId(saved.selectedCourseId || saved.result.ranking[0].id);
    } catch { router.replace("/dattometro"); }
  }, [router]);

  const career = useMemo(() => getCareer(selectedCourseId), [selectedCourseId]);
  const suggestions = useMemo(() => data ? getTopCareers(data.result, 3) : [], [data]);
  const lineMax = data ? Math.max(...Object.values(data.result.lineScores), 1) : 1;
  const rankingMax = data ? Math.max(data.result.ranking[0]?.score || 1, 1) : 1;

  function chooseCourse(id: string) {
    setSelectedCourseId(id);
    try {
      const stored = sessionStorage.getItem("dattoMetroResult");
      if (stored) { const parsed = JSON.parse(stored) as Saved; parsed.selectedCourseId = id; sessionStorage.setItem("dattoMetroResult", JSON.stringify(parsed)); }
    } catch { /* La tarjeta conserva el destino elegido durante esta página. */ }
  }
  function restart() { try { sessionStorage.removeItem("dattoMetroResult"); } catch {} router.push("/dattometro"); }
  function printCard() { router.push("/dattometro-card?prepare=1"); }
  async function showPhoneCard() {
    if (!data) return;
    setShareOpen(true);
    setQrLoading(true);
    setQrError("");
    setQrData("");
    setQrUsesLan(false);
    try {
      let origin = window.location.origin;
      const hostname = window.location.hostname;
      const localHost = hostname === "localhost" || hostname === "127.0.0.1" || hostname === "0.0.0.0" || /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(hostname);
      if (localHost) {
        setQrUsesLan(true);
        const response = await fetch("/api/network-address", { cache: "no-store" });
        const network = await response.json() as { address: string | null; port: string };
        if (!network.address) throw new Error("No encontramos una dirección de red local.");
        origin = `http://${network.address}:${network.port}`;
      }
      const token = encodeTicket({ n: data.name, c: selectedCourseId, a: data.answers });
      const url = `${origin}/dattometro-card?ticket=${encodeURIComponent(token)}`;
      const image = await QRCode.toDataURL(url, { errorCorrectionLevel: "Q", margin: 2, width: 260, color: { dark: "#17211a", light: "#ffffff" } });
      setShareUrl(url);
      setQrData(image);
    } catch (error) {
      setQrError(error instanceof Error ? error.message : "No pudimos preparar el código QR.");
    } finally {
      setQrLoading(false);
    }
  }

  if (!data) return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f4f4ef", color: muted, fontFamily: "Arial,sans-serif" }}>Preparando tu mapa de posibilidades…</main>;

  const currentLine = lines[career.line];
  const sections: LineId[] = ["A", "B", "C", "D"];
  return <main style={{ minHeight: "100vh", padding: "0 0 34px", background: "#f4f4ef", color: ink, fontFamily: "Arial,sans-serif" }}>
    <header style={{ maxWidth: 1280, margin: "0 auto", padding: "22px 5.4vw", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, borderBottom: "1px solid #dfe3dc" }}><a href="/" style={{ textDecoration: "none", fontSize: 18, fontWeight: 800 }}>IES<span style={{ color: "#8aa840", padding: "0 3px" }}>·</span>9</a><span style={{ color: muted, fontFamily: "monospace", letterSpacing: 1, fontSize: 9 }}>MAPA DE POSIBILIDADES <b style={{ color: ink, fontWeight: 500 }}>2030</b></span><button onClick={restart} style={{ background: "none", border: 0, color: "#69736c", fontFamily: "monospace", fontSize: 9, cursor: "pointer" }}>NUEVO RECORRIDO ↺</button></header>
    <div style={{ width: "100%", maxWidth: 1000, margin: "0 auto", padding: "38px 5.4vw 0" }}>
      <section style={{ marginBottom: 25 }}><p style={{ color: "#678244", fontFamily: "monospace", letterSpacing: 1.5, fontSize: 9, margin: "0 0 11px" }}>✦ BRÚJULA DE AFINIDADES · PASAJERO/A {data.name}</p><h1 style={{ margin: 0, maxWidth: 720, fontSize: "clamp(32px,5vw,50px)", letterSpacing: -2.2, lineHeight: 1.05 }}>Tu recorrido abre <span style={{ color: "#859e4e" }}>varios caminos.</span></h1><p style={{ maxWidth: 690, color: "#67716a", fontSize: 13, lineHeight: 1.65, margin: "12px 0 0" }}>El cuestionario encontró afinidades, no una respuesta única. Mirá las tres rutas sugeridas, explorá las 18 carreras y elegí cuál querés llevarte en tu tarjeta.</p></section>

      <section style={{ ...card, padding: "20px 22px", marginBottom: 15 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, marginBottom: 14 }}><div><p style={{ color: "#678244", fontFamily: "monospace", fontSize: 9, letterSpacing: 1.4, margin: "0 0 5px" }}>TU CONSTELACIÓN</p><h2 style={{ margin: 0, fontSize: 18, letterSpacing: -.4 }}>Intereses en movimiento</h2></div><span style={{ color: "#8d968d", fontSize: 9 }}>Se pueden combinar</span></div>
        <div style={{ display: "grid", gap: 11 }}>{sections.map((id: LineId) => { const item = lines[id]; const score = data.result.lineScores[id]; const width = Math.max(score ? 8 : 0, score / lineMax * 100); return <div key={id} style={{ display: "grid", gridTemplateColumns: "25px minmax(95px,180px) minmax(60px,1fr) 28px", alignItems: "center", gap: 10 }}><span style={{ display: "grid", placeItems: "center", width: 23, height: 23, border: `1px solid ${item.color}66`, borderRadius: "50%", color: item.color, fontFamily: "monospace", fontSize: 10 }}>{id}</span><div><strong style={{ display: "block", fontSize: 10 }}>{item.name}</strong><span style={{ color: muted, fontSize: 9 }}>{item.short}</span></div><div style={{ height: 5, background: "#edf0e9", borderRadius: 9, overflow: "hidden" }}><span style={{ display: "block", width: `${width}%`, height: "100%", borderRadius: 9, background: item.color, transition: "width .3s" }} /></div><span style={{ textAlign: "right", color: "#778077", fontFamily: "monospace", fontSize: 9 }}>{score}</span></div>; })}</div>
      </section>

      <section style={{ margin: "24px 0" }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 10, marginBottom: 12 }}><div><p style={{ color: "#678244", fontFamily: "monospace", fontSize: 9, letterSpacing: 1.4, margin: "0 0 5px" }}>TRES POSIBLES DESTINOS</p><h2 style={{ margin: 0, fontSize: 19, letterSpacing: -.5 }}>Carreras para explorar</h2></div><span style={{ color: muted, fontSize: 9 }}>No es un orden de importancia</span></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,230px),1fr))", gap: 10 }}>{suggestions.map((item, index) => { const score = data.result.ranking.find(row => row.id === item.id)?.score || 0; const chosen = career.id === item.id; return <article key={item.id} style={{ ...card, padding: "16px", borderColor: chosen ? `${item.color}88` : "#e5e7e1", boxShadow: chosen ? `0 0 0 1px ${item.color}44` : card.boxShadow }}><div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}><span style={{ color: item.color, fontFamily: "monospace", fontSize: 9, letterSpacing: 1 }}>RUTA {item.line} · OPCIÓN 0{index + 1}</span><span style={{ color: muted, fontFamily: "monospace", fontSize: 9 }}>{Math.round(score / rankingMax * 100)}% afinidad</span></div><p style={{ color: "#808b81", fontSize: 9, margin: "10px 0 4px" }}>{item.area}</p><h3 style={{ minHeight: 46, margin: 0, fontSize: 14, lineHeight: 1.4 }}>{item.title}</h3><p style={{ minHeight: 48, margin: "7px 0 13px", color: "#758075", fontSize: 10, lineHeight: 1.5 }}>{item.description}</p><button type="button" aria-pressed={chosen} onClick={() => chooseCourse(item.id)} style={{ width: "100%", minHeight: 36, color: chosen ? "#2d3c25" : ink, background: chosen ? "#edf4df" : "white", border: `1px solid ${chosen ? "#b8cc8f" : "#dfe3dc"}`, borderRadius: 4, fontSize: 10, fontWeight: 700, cursor: "pointer" }}>{chosen ? "✓ Elegida para mi tarjeta" : "Elegir este destino"}</button></article>; })}</div>
      </section>

      <section style={{ ...card, margin: "21px 0", padding: "18px 20px", borderLeft: `4px solid ${currentLine.color}` }}><div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12, alignItems: "start" }}><div><p style={{ color: currentLine.color, fontFamily: "monospace", fontSize: 9, letterSpacing: 1.2, margin: "0 0 6px" }}>TU SELECCIÓN ACTUAL · LÍNEA {career.line} / {currentLine.name}</p><h2 style={{ margin: 0, fontSize: 18, lineHeight: 1.35 }}>{career.title}</h2><p style={{ color: muted, fontSize: 10, margin: "6px 0 0" }}>{career.description}</p></div><span style={{ color: "#859e4e", fontFamily: "monospace", fontSize: 9, border: "1px solid #e0e6d9", padding: "7px 9px", borderRadius: 4 }}>18 CARRERAS</span></div>
        <div style={{ marginTop: 17, borderTop: "1px solid #e9ece6", paddingTop: 14 }}><p style={{ color: "#678244", fontFamily: "monospace", fontSize: 9, letterSpacing: 1.2, margin: "0 0 9px" }}>EXPLORAR EL CATÁLOGO OFICIAL</p><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,215px),1fr))", gap: 8 }}>{sections.map((id: LineId) => <details key={id} open={id === career.line} style={{ border: "1px solid #e4e8e1", borderRadius: 5, background: "#fbfcf9", padding: "9px 10px" }}><summary style={{ color: lines[id].color, fontSize: 10, fontWeight: 800, cursor: "pointer" }}>LÍNEA {id} · {careers.filter(c => c.line === id).length} carreras</summary><div style={{ display: "grid", gap: 5, marginTop: 8 }}>{careers.filter(c => c.line === id).map(c => <button key={c.id} type="button" onClick={() => chooseCourse(c.id)} style={{ padding: "8px 8px", textAlign: "left", border: `1px solid ${career.id === c.id ? c.color : "#e6e9e3"}`, borderRadius: 4, color: ink, background: career.id === c.id ? "#f1f5e9" : "#fff", cursor: "pointer", fontSize: 9, lineHeight: 1.45 }}>{c.title}{career.id === c.id && <span aria-hidden="true" style={{ color: c.color, float: "right" }}>✓</span>}</button>)}</div></details>)}</div></div>
      </section>

      <section style={{ ...card, padding: "18px 20px", background: "#eef1e7" }}><div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, alignItems: "baseline" }}><div><p style={{ color: "#678244", fontFamily: "monospace", fontSize: 9, letterSpacing: 1.3, margin: "0 0 5px" }}>SUELDO DE REFERENCIA · {career.salary.label}</p><h2 style={{ margin: 0, fontSize: 19 }}>Una pista para pensar el futuro</h2></div><span style={{ color: "#697769", fontSize: 9 }}>Montos nominales publicados en 2026</span></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,210px),1fr))", gap: 9, marginTop: 14 }}><div style={{ padding: "13px", background: "#fff", border: "1px solid #dde4d7", borderRadius: 5 }}><span style={{ color: muted, fontSize: 9 }}>REFERENCIA INICIAL / JUNIOR</span><strong style={{ display: "block", marginTop: 7, color: "#28372b", fontSize: 19, letterSpacing: -.4 }}>{career.salary.junior}</strong><span style={{ display: "block", marginTop: 5, color: muted, fontSize: 9 }}>{career.salary.label}</span></div><div style={{ padding: "13px", background: "#fff", border: "1px solid #dde4d7", borderRadius: 5 }}><span style={{ color: muted, fontSize: 9 }}>TRAYECTORIA / EXPERIENCIA</span><strong style={{ display: "block", marginTop: 7, color: "#28372b", fontSize: 13, lineHeight: 1.4 }}>{career.salary.senior}</strong><span style={{ display: "block", marginTop: 5, color: muted, fontSize: 9 }}>Depende de cargo, experiencia y empleador.</span></div></div>
        <p style={{ color: "#68736a", fontSize: 9, lineHeight: 1.55, margin: "11px 0 0" }}>{career.salary.note} <a href={career.salary.sourceUrl} target="_blank" rel="noreferrer" style={{ color: "#405c32", fontWeight: 700 }}>Fuente: {career.salary.source} ↗</a></p>
        <div style={{ marginTop: 10, padding: "9px 11px", borderLeft: "2px solid #94a76c", color: "#606d61", background: "#e4eadb", fontSize: 9, lineHeight: 1.5 }}>La cifra de 2026 sirve de referencia y no permite predecir un monto nominal para 2030. El mercado, el rol y la experiencia cambian los ingresos.</div>
      </section>

      <section style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 13, margin: "21px 0", padding: "17px 19px", color: "#f2f4ed", background: "#172b22", borderRadius: 7 }}><span aria-hidden="true" style={{ display: "grid", placeItems: "center", width: 35, height: 35, borderRadius: "50%", color: "#c5f36a", border: "1px solid #c5f36a66", fontSize: 17 }}>✦</span><div style={{ flex: 1, minWidth: 210 }}><span style={{ color: "#c5f36a", fontFamily: "monospace", fontSize: 9, letterSpacing: 1.1 }}>CONEXIÓN STAR · LÍNEA D</span><p style={{ color: "#d5ddd3", fontSize: 10, lineHeight: 1.55, margin: "5px 0 0" }}>Ciencia de Datos e IA puede complementar cualquiera de estas rutas. Sumá herramientas de datos para explorar nuevas formas de resolver problemas.</p></div><span style={{ color: "#c5f36a", fontSize: 9, fontFamily: "monospace" }}>DATOS + FUTURO</span></section>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 9, alignItems: "center" }}><button onClick={printCard} style={{ flex: "1 1 220px", minHeight: 48, padding: "0 16px", display: "inline-flex", justifyContent: "space-between", alignItems: "center", gap: 12, border: 0, borderRadius: 4, color: "#172017", background: lime, fontSize: 12, fontWeight: 800, cursor: "pointer" }}><span>Imprimir / guardar mi tarjeta</span><span aria-hidden="true" style={{ fontSize: 16 }}>↗</span></button><button onClick={showPhoneCard} style={{ flex: "1 1 210px", minHeight: 48, padding: "0 15px", color: "#344331", border: "1px solid #cfd8c8", borderRadius: 4, background: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>▦ Ver en el teléfono</button><button onClick={restart} style={{ minHeight: 46, padding: "0 15px", color: "#526052", border: "1px solid #dfe3dc", borderRadius: 4, background: "transparent", fontSize: 10, cursor: "pointer" }}>Otro pasajero ↺</button></div>
      <p style={{ margin: "16px 0 0", color: "#939b92", textAlign: "center", fontFamily: "monospace", fontSize: 8, letterSpacing: .8 }}>UNA BRÚJULA PARA EXPLORAR · NO UN TEST VOCACIONAL NI UNA PREDICCIÓN DEL FUTURO</p>
    </div>
    {shareOpen && <div role="presentation" onClick={() => setShareOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 20, display: "grid", placeItems: "center", padding: 18, background: "rgba(15,25,18,.55)", backdropFilter: "blur(3px)" }}><section role="dialog" aria-modal="true" aria-labelledby="share-title" onClick={event => event.stopPropagation()} style={{ width: "100%", maxWidth: 390, boxSizing: "border-box", padding: 22, border: "1px solid #dfe3dc", borderRadius: 9, background: "#fff", color: ink, textAlign: "center", boxShadow: "0 28px 90px rgba(0,0,0,.24)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}><span style={{ color: "#678244", fontFamily: "monospace", fontSize: 9, letterSpacing: 1.3 }}>TARJETA DIGITAL</span><button onClick={() => setShareOpen(false)} aria-label="Cerrar" style={{ width: 30, height: 30, border: "1px solid #e1e5de", borderRadius: "50%", background: "#fff", color: "#67716a", cursor: "pointer" }}>×</button></div>
      <h2 id="share-title" style={{ margin: "10px 0 7px", fontSize: 22, letterSpacing: -.6 }}>Escaneá y llevátela</h2><p style={{ color: "#717b72", fontSize: 11, lineHeight: 1.55, margin: "0 0 15px" }}>Abrí la cámara del teléfono y apuntá al código para ver la tarjeta.</p>
      {qrLoading ? <div style={{ minHeight: 220, display: "grid", placeItems: "center", color: "#73806f", fontSize: 11 }}>Preparando el QR…</div> : qrData ? <img src={qrData} alt="Código QR para abrir la tarjeta en un teléfono" width={220} height={220} style={{ width: 220, height: 220, imageRendering: "pixelated", border: "1px solid #e4e8e1", borderRadius: 5 }} /> : <div style={{ minHeight: 90, display: "grid", placeItems: "center", color: "#8a564b", fontSize: 11, lineHeight: 1.5 }}>{qrError}</div>}
      <p style={{ color: "#859085", fontSize: 9, lineHeight: 1.55, margin: "13px 0 0" }}>{qrUsesLan ? "Modo de red local: conectá la notebook y el teléfono a la misma Wi-Fi para abrir la tarjeta." : "En un dominio público, la tarjeta se abre desde cualquier conexión, incluso con datos móviles."} Quien escanee el QR podrá ver esta tarjeta.</p>
      {shareUrl && <details style={{ marginTop: 9, textAlign: "left" }}><summary style={{ color: "#657260", fontSize: 9, cursor: "pointer" }}>Ver enlace de la tarjeta</summary><div style={{ marginTop: 6, overflowWrap: "anywhere", color: "#829080", fontSize: 8, lineHeight: 1.4 }}>{shareUrl}</div></details>}
    </section></div>}
  </main>;
}
