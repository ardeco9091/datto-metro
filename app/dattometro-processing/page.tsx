"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const lines = ["Sincronizando las carreras del IES N° 9...", "Comparando tus intereses con las cuatro líneas...", "Preparando tus tres rutas posibles..."];

export default function Processing() {
  const router = useRouter();
  const [progress, setProgress] = useState(5);
  const [message, setMessage] = useState(0);
  useEffect(() => {
    if (!sessionStorage.getItem("dattoMetroResult")) { router.replace("/dattometro"); return; }
    const started = Date.now();
    const interval = window.setInterval(() => {
      const elapsed = Date.now() - started;
      setProgress(Math.min(100, 5 + Math.round((elapsed / 2300) * 95)));
      setMessage(Math.min(lines.length - 1, Math.floor(elapsed / 760)));
      if (elapsed >= 2600) { window.clearInterval(interval); router.replace("/dattometro-result"); }
    }, 90);
    return () => window.clearInterval(interval);
  }, [router]);

  return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", boxSizing: "border-box", padding: 22, color: "#f4f4ef", background: "radial-gradient(ellipse at 50% 20%,#263d31,#0b1613 70%)", fontFamily: "Arial,sans-serif" }}><section style={{ width: "100%", maxWidth: 560, padding: "clamp(26px,5vw,40px)", border: "1px solid #ffffff26", borderRadius: 8, background: "rgba(18,35,30,.88)", boxShadow: "0 25px 90px rgba(0,0,0,.25)" }}>
    <div style={{ color: "#c5f36a", fontFamily: "monospace", fontSize: 9, letterSpacing: 2 }}>IES N° 9 <span style={{ color: "#8b9e8d" }}>· MOTOR DE POSIBILIDADES</span></div>
    <h1 style={{ margin: "21px 0 7px", fontSize: "clamp(26px,6vw,38px)", fontWeight: 600, letterSpacing: -1.2 }}>Conectando tus ideas<span style={{ color: "#c5f36a" }}>…</span></h1>
    <p style={{ color: "#b0bdb1", fontSize: 12, lineHeight: 1.6, margin: 0 }}>Buscando patrones en tus respuestas y posibles destinos.</p>
    <div aria-hidden="true" style={{ display: "flex", justifyContent: "center", gap: 16, margin: "26px 0 24px" }}>{[["A","#c5f36a"],["B","#b4edc4"],["C","#f5bc88"],["D","#c5f36a"]].map(([letter,color],index) => { const active = progress >= index * 22; return <div key={letter} style={{ width: 48, height: 48, display: "grid", placeItems: "center", border: `1px solid ${active ? `${color}aa` : "#ffffff24"}`, borderRadius: "50%", color: active ? color : "#87968a", background: active ? `${color}18` : "transparent", fontFamily: "monospace", fontSize: 12, boxShadow: active ? `0 0 22px ${color}19` : "none", transition: "all .2s" }}>{letter}</div>; })}</div>
    <div style={{ height: 3, borderRadius: 9, overflow: "hidden", background: "#ffffff1d" }}><div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg,#a7cc5d,#c5f36a)", transition: "width .1s linear" }} /></div>
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, color: "#9ba99c", fontFamily: "monospace", fontSize: 8, letterSpacing: 1 }}><span>CALCULANDO RECORRIDO</span><span style={{ color: "#c5f36a" }}>{progress}%</span></div>
    <div aria-live="polite" style={{ minHeight: 43, display: "flex", alignItems: "center", gap: 10, marginTop: 21, padding: "0 12px", borderLeft: "2px solid #c5f36a", background: "#ffffff08", color: "#dce6db", fontFamily: "monospace", fontSize: 10 }}><span style={{ color: "#c5f36a" }}>&gt;_</span>{lines[message]}</div>
  </section></main>;
}
