"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { buildMetroResult, careers, lines, questions, type Answers, type LineId } from "../../lib/metro";

const ink = "#17211a";
const muted = "#717b72";
const lime = "#c5f36a";
const paper = "#f4f4ef";
const card: React.CSSProperties = { background: "#fff", border: "1px solid #e5e7e1", borderRadius: 9, boxShadow: "0 18px 60px rgba(57,73,43,.07)" };

function AnswerButton({ item, index, selected, onClick }: { item: (typeof questions)[number]["answers"][number]; index: number; selected: boolean; onClick: () => void }) {
  const color = selected ? "#879d56" : "#e4e8e1";
  return <button type="button" aria-pressed={selected} onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 65, padding: "11px 13px", borderRadius: 6, border: `1px solid ${color}`, background: selected ? "#f7faef" : "#fff", color: ink, textAlign: "left", cursor: "pointer", transition: "border-color .16s,background .16s,transform .16s" }}>
    <span style={{ width: 27, height: 27, flex: "0 0 27px", display: "grid", placeItems: "center", borderRadius: "50%", border: `1px solid ${selected ? "#8ba84f" : "#e0e4dc"}`, background: selected ? "#8ba84f" : "transparent", color: selected ? "white" : "#8b9685", fontFamily: "monospace", fontSize: 10 }}>{String.fromCharCode(65 + index)}</span>
    <span style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}><strong style={{ fontSize: 12, lineHeight: 1.4, fontWeight: 700 }}>{item.title}</strong><small style={{ color: "#858d85", fontSize: 10, lineHeight: 1.4 }}>{item.detail}</small></span>
    <span aria-hidden="true" style={{ color: selected ? "#718b44" : "#abb1a9", fontSize: 16, opacity: selected ? 1 : 0 }}>↗</span>
  </button>;
}

export default function DattoMetro() {
  const router = useRouter();
  const [candidate, setCandidate] = useState("");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>([]);
  const selected = answers[step] ?? null;
  const question = questions[step];
  const progress = useMemo(() => Math.round(((step + (selected !== null ? 1 : 0)) / questions.length) * 100), [step, selected]);

  function choose(index: number) {
    const next = answers.slice();
    next[step] = index;
    setAnswers(next);
  }

  function advance() {
    if (selected === null) return;
    if (step < questions.length - 1) { setStep(step + 1); return; }
    const completeAnswers = questions.map((_, index) => answers[index]);
    const result = buildMetroResult(completeAnswers);
    const name = candidate.trim() || "Pasajero/a";
    const payload = { name, answers: completeAnswers, result, selectedCourseId: result.ranking[0]?.id || careers[0].id, createdAt: new Date().toISOString() };
    try { sessionStorage.setItem("dattoMetroResult", JSON.stringify(payload)); } catch { /* La ruta de destino sigue disponible durante el recorrido. */ }
    router.push("/dattometro-processing");
  }

  const header: React.CSSProperties = { maxWidth: 1280, margin: "0 auto", padding: "22px 5.4vw", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, borderBottom: "1px solid #dfe3dc" };
  const titleFace = "'Arial', sans-serif";
  return <main style={{ minHeight: "100vh", color: ink, background: `radial-gradient(ellipse at 82% 28%,#e9eedf 0%,transparent 24%),${paper}`, fontFamily: titleFace }}>
    <header style={header}><a href="/" style={{ textDecoration: "none", fontSize: 18, fontWeight: 800, letterSpacing: -1 }}>IES<span style={{ color: "#8aa840", padding: "0 3px" }}>·</span>9</a><span style={{ color: "#778077", fontFamily: "monospace", letterSpacing: 1.1, fontSize: 9 }}>EXPO TECH <b style={{ color: ink, fontWeight: 500 }}>2026</b></span><span style={{ color: "#69736c", fontFamily: "monospace", fontSize: 9 }}>JUJUY · ARGENTINA</span></header>
    <section style={{ maxWidth: 1160, minHeight: "calc(100vh - 75px)", padding: "48px 5.4vw 28px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,400px),1fr))", columnGap: "7%", alignContent: "center", alignItems: "center" }}>
      <aside style={{ padding: "0 0 28px" }}><p style={{ display: "flex", alignItems: "center", gap: 9, color: "#678244", fontFamily: "monospace", fontSize: 9, letterSpacing: 1.5 }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: "#8bac4c", boxShadow: "0 0 0 4px #e3ebd4" }} />DATTO-METRO · ORIENTADOR DE RUTAS</p>
        <h1 style={{ maxWidth: 520, margin: "22px 0 18px", fontSize: "clamp(40px,5.2vw,66px)", lineHeight: .99, letterSpacing: -3.8, fontWeight: 650 }}>El futuro<br />no se adivina.<br /><span style={{ color: "#859e4e" }}>Se explora.</span></h1>
        <p style={{ maxWidth: 360, color: "#67716a", fontSize: 14, lineHeight: 1.7, margin: 0 }}>Cinco situaciones para descubrir afinidades. El resultado abre rutas posibles: las 18 carreras siguen siendo tuyas para explorar.</p>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 21, color: "#7b877b", fontSize: 9, fontFamily: "monospace", letterSpacing: .7 }}><span style={{ color: "#8aa840", fontSize: 14 }}>✦</span> NO ES UN TEST VOCACIONAL <span style={{ color: "#c2c9bd" }}>·</span> NO HAY RESPUESTAS INCORRECTAS</div>
        <div style={{ ...card, marginTop: 27, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14, background: "#172b22", borderColor: "#172b22", color: "#f2f4ed" }}><div aria-hidden="true" style={{ display: "flex", flexDirection: "column", gap: 5, alignItems: "center" }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#c5f36a" }} /><span style={{ width: 2, height: 28, background: "linear-gradient(#c5f36a,#aebda1,#b88a60)" }} /><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#b88a60" }} /></div><div><div style={{ color: "#c5f36a", fontFamily: "monospace", letterSpacing: 1.2, fontSize: 9 }}>4 LÍNEAS · 18 CARRERAS</div><div style={{ color: "#d1d8ce", fontSize: 11, marginTop: 5 }}>Datos reales para descubrir tu próximo destino.</div></div></div>
      </aside>

      <section aria-labelledby="question-title" style={{ ...card, padding: "clamp(20px,3vw,31px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", color: "#8b938b", fontFamily: "monospace", letterSpacing: .8, fontSize: 9 }}><span>RECORRIDO <b style={{ color: "#374334", fontWeight: 500 }}>{String(step + 1).padStart(2, "0")}</b> / {String(questions.length).padStart(2, "0")}</span><span>{progress}%</span></div>
        <div aria-hidden="true" style={{ height: 3, background: "#eceee9", marginTop: 12, borderRadius: 9, overflow: "hidden" }}><span style={{ display: "block", width: `${progress}%`, height: "100%", background: "#91ae59", transition: "width .25s" }} /></div>
        <div style={{ display: "flex", gap: 15, margin: "25px 0 20px" }}><span aria-hidden="true" style={{ color: "#889b61", fontFamily: "monospace", fontSize: 11, paddingTop: 3 }}>0{step + 1}</span><div><h2 id="question-title" style={{ margin: 0, fontSize: 20, lineHeight: 1.3, letterSpacing: -.45, fontWeight: 700 }}>{question.prompt}</h2><p style={{ margin: "6px 0 0", color: "#8a918b", fontSize: 11, lineHeight: 1.5 }}>{question.hint}</p></div></div>
        {step === 0 && <label style={{ display: "block", margin: "0 0 15px", color: "#626c64", fontSize: 10 }}>¿Cómo te llamamos? <span style={{ color: "#a1a7a1" }}>· opcional</span><input maxLength={28} value={candidate} onChange={event => setCandidate(event.target.value)} placeholder="Tu nombre o apodo" style={{ display: "block", width: "100%", boxSizing: "border-box", marginTop: 7, padding: "11px 12px", border: "1px solid #e4e8e1", borderRadius: 5, background: "#fafbf8", color: ink, fontFamily: titleFace, fontSize: 12, outlineColor: "#91ae59" }} /></label>}
        <div role="group" aria-labelledby="question-title" style={{ display: "flex", flexDirection: "column", gap: 8 }}>{question.answers.map((answer, index) => <AnswerButton key={answer.title} item={answer} index={index} selected={selected === index} onClick={() => choose(index)} />)}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginTop: 20 }}><span style={{ color: "#8e968f", fontSize: 9 }}>✦ Tus respuestas se procesan en este dispositivo.</span><div style={{ display: "flex", gap: 8 }}>
          {step > 0 && <button type="button" onClick={() => setStep(step - 1)} style={{ minHeight: 43, padding: "0 13px", color: "#67716a", border: "1px solid #dfe3dc", borderRadius: 4, background: "#fff", fontSize: 11, cursor: "pointer" }}>← Atrás</button>}
          <button type="button" disabled={selected === null} onClick={advance} style={{ minHeight: 43, padding: "0 16px", display: "inline-flex", alignItems: "center", gap: 16, color: selected === null ? "#9ba196" : "#172017", background: selected === null ? "#e6e9e1" : lime, border: 0, borderRadius: 4, fontSize: 11, fontWeight: 800, cursor: selected === null ? "not-allowed" : "pointer" }}>{step === questions.length - 1 ? "Ver mis afinidades" : "Siguiente pregunta"}<span aria-hidden="true" style={{ fontSize: 15 }}>→</span></button>
        </div></div>
      </section>
      <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "#9aa198", fontFamily: "monospace", letterSpacing: 1, fontSize: 8, margin: "20px 0 0" }}>IES N° 9 JUANA AZURDUY <span style={{ color: "#a0b773" }}>·</span> DATOS, COMUNIDAD Y FUTURO</p>
    </section>
  </main>;
}
