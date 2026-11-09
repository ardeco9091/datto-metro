export type LineId = "A" | "B" | "C" | "D";
export type Answers = number[];
export type SalaryReference = {
  junior: string;
  senior: string;
  label: string;
  note: string;
  source: string;
  sourceUrl: string;
};
export type Career = {
  id: string;
  line: LineId;
  color: string;
  area: string;
  title: string;
  description: string;
  tags: string[];
  salary: SalaryReference;
};

export const lines: Record<LineId, { name: string; short: string; color: string }> = {
  A: { name: "Educación & Ciencias Sociales", short: "Personas, ideas y comunidad", color: "#849a52" },
  B: { name: "Ciencias Exactas & Naturales", short: "Preguntas, laboratorio y naturaleza", color: "#788a83" },
  C: { name: "Deporte, Industria & Gestión", short: "Acción, procesos y desarrollo local", color: "#bc8956" },
  D: { name: "Tecnología, Innovación & IA", short: "Sistemas, datos y nuevas herramientas", color: "#789385" },
};

const salaryLinks = {
  provincial: "https://prensa.jujuy.gob.ar/gobierno-jujuy/el-gobierno-jujuy-acepto-la-contrapropuesta-del-6-y-garantiza-elevar-1-millon-el-salario-inicial-estatal-n125168",
  sysarmy: "https://sysarmy.com/blog/posts/resultados-de-la-encuesta-de-sueldos-2026-1/",
  support: "https://www.coderhouse.com/coderlibrary/cuanto-gana-un-tecnico-de-soporte-it-argentina",
  data: "https://institutoiea.edu.ar/publicaciones/que-hace-un-analista-de-datos-y-cuanto-gana",
};

const publicReference = (junior: string, label: string, note: string): SalaryReference => ({
  junior,
  senior: "Varía según cargo, experiencia y convenio",
  label,
  note,
  source: "Gobierno de Jujuy · noviembre 2026",
  sourceUrl: salaryLinks.provincial,
});

const itReference = (junior: string, senior: string, label: string, note: string, source = "Sysarmy 2026.1 · muestra argentina"): SalaryReference => ({
  junior,
  senior,
  label,
  note,
  source,
  sourceUrl: source.startsWith("Soporte") ? salaryLinks.support : source.startsWith("Datos") ? salaryLinks.data : salaryLinks.sysarmy,
});

export const careers: Career[] = [
  { id: "lengua-literatura", line: "A", color: lines.A.color, area: "Lengua & enseñanza", title: "Profesorado en Lengua y Literatura", description: "Explorá el poder de las palabras y acompañá nuevas formas de leer, escribir y pensar.", tags: ["language", "teaching", "communication"], salary: publicReference("ARS 1.070.000", "Piso docente provincial", "Piso salarial inicial del sector docente en Jujuy; no es un sueldo individual garantizado.") },
  { id: "nivel-inicial", line: "A", color: lines.A.color, area: "Infancias & enseñanza", title: "Profesorado en Nivel Inicial", description: "Acompañá los primeros aprendizajes con juego, cuidado y curiosidad.", tags: ["teaching", "people", "early"], salary: publicReference("ARS 1.070.000", "Piso docente provincial", "Piso salarial inicial del sector docente en Jujuy; varía según cargo y antigüedad.") },
  { id: "educacion-primaria", line: "A", color: lines.A.color, area: "Enseñanza", title: "Profesorado en Educación Primaria", description: "Convertí cada pregunta en una oportunidad para aprender y crecer.", tags: ["teaching", "people", "community"], salary: publicReference("ARS 1.070.000", "Piso docente provincial", "Piso salarial inicial del sector docente en Jujuy; varía según cargo y antigüedad.") },
  { id: "ingles", line: "A", color: lines.A.color, area: "Idiomas & enseñanza", title: "Profesorado de Inglés", description: "Conectá personas y culturas a través del idioma y la enseñanza.", tags: ["language", "teaching", "global"], salary: publicReference("ARS 1.070.000", "Piso docente provincial", "Piso salarial inicial del sector docente en Jujuy; varía según cargo y antigüedad.") },
  { id: "geografia", line: "A", color: lines.A.color, area: "Territorio & enseñanza", title: "Profesorado de Educación Secundaria en Geografía", description: "Leé el territorio y sus cambios para entender cómo vivimos en él.", tags: ["geography", "nature", "teaching"], salary: publicReference("ARS 1.070.000", "Piso docente provincial", "Piso salarial inicial del sector docente en Jujuy; varía según cargo y antigüedad.") },
  { id: "trabajo-social", line: "A", color: lines.A.color, area: "Comunidad & derechos", title: "Tecnicatura Superior en Trabajo Social", description: "Fortalecé redes comunitarias y acompañá el acceso a derechos.", tags: ["community", "people", "care"], salary: publicReference("ARS 1.000.000", "Piso estatal general", "Referencia mínima inicial del escalafón general provincial; no equivale a la remuneración profesional.") },
  { id: "comunicacion-social", line: "A", color: lines.A.color, area: "Comunicación & territorio", title: "Tecnicatura Superior en Comunicación Social con orientación al desarrollo local", description: "Contá historias que conecten comunidades con iniciativas de desarrollo local.", tags: ["communication", "language", "community"], salary: publicReference("ARS 1.000.000", "Piso estatal general", "Referencia mínima inicial del escalafón general provincial; el salario depende del puesto y empleador.") },
  { id: "matematica", line: "B", color: lines.B.color, area: "Matemática & enseñanza", title: "Profesorado de Educación Secundaria en Matemática", description: "Usá el razonamiento para encontrar patrones y abrir nuevas preguntas.", tags: ["math", "teaching", "logic"], salary: publicReference("ARS 1.070.000", "Piso docente provincial", "Piso salarial inicial del sector docente en Jujuy; varía según cargo y antigüedad.") },
  { id: "biologia", line: "B", color: lines.B.color, area: "Biología & enseñanza", title: "Profesorado de Educación Secundaria en Biología", description: "Descubrí cómo funciona la vida y acercá la ciencia al aula.", tags: ["biology", "nature", "teaching"], salary: publicReference("ARS 1.070.000", "Piso docente provincial", "Piso salarial inicial del sector docente en Jujuy; varía según cargo y antigüedad.") },
  { id: "quimica", line: "B", color: lines.B.color, area: "Química & enseñanza", title: "Profesorado de Educación Secundaria en Química", description: "Investigá la materia y compartí el entusiasmo por experimentar.", tags: ["chemistry", "science", "teaching"], salary: publicReference("ARS 1.070.000", "Piso docente provincial", "Piso salarial inicial del sector docente en Jujuy; varía según cargo y antigüedad.") },
  { id: "fisica", line: "B", color: lines.B.color, area: "Física & enseñanza", title: "Profesorado de Educación Secundaria en Física", description: "Buscá las reglas que explican el movimiento y la energía del universo.", tags: ["physics", "math", "teaching"], salary: publicReference("ARS 1.070.000", "Piso docente provincial", "Piso salarial inicial del sector docente en Jujuy; varía según cargo y antigüedad.") },
  { id: "entrenamiento-deportivo", line: "C", color: lines.C.color, area: "Deporte & rendimiento", title: "Tecnicatura Superior en Entrenamiento Deportivo", description: "Acompañá el rendimiento, el movimiento y el bienestar de las personas.", tags: ["sport", "people", "movement"], salary: publicReference("ARS 1.000.000", "Piso estatal general", "Referencia mínima inicial del escalafón general provincial; no representa un sueldo de entrenador/a.") },
  { id: "comercializacion", line: "C", color: lines.C.color, area: "Mercados & gestión", title: "Tecnicatura Superior en Comercialización", description: "Conectá productos, mercados y personas con ideas y estrategias.", tags: ["business", "communication", "organization"], salary: publicReference("ARS 1.000.000", "Piso estatal general", "Referencia mínima inicial del escalafón general provincial; el salario privado varía por sector y empleador.") },
  { id: "higiene-seguridad", line: "C", color: lines.C.color, area: "Seguridad & procesos", title: "Tecnicatura Superior en Higiene y Seguridad en el Trabajo", description: "Mejorá procesos y cuidá a las personas en sus espacios de trabajo.", tags: ["safety", "industry", "care"], salary: publicReference("ARS 1.000.000", "Piso estatal general", "Referencia mínima inicial del escalafón general provincial; no es una escala profesional específica.") },
  { id: "quimica-agroindustrial", line: "C", color: lines.C.color, area: "Agroindustria & laboratorio", title: "Tecnicatura Superior en Química Agroindustrial", description: "Aplicá la química a la innovación y producción agroindustrial.", tags: ["chemistry", "industry", "nature"], salary: publicReference("ARS 1.000.000", "Piso estatal general", "Referencia mínima inicial del escalafón general provincial; el salario depende del puesto y convenio.") },
  { id: "recursos-hidricos", line: "C", color: lines.C.color, area: "Agua & sostenibilidad", title: "Tecnicatura Superior en Gestión de los Recursos Hídricos con orientación en Riego", description: "Pensá soluciones para el agua, el riego y el desarrollo sostenible.", tags: ["water", "nature", "industry"], salary: publicReference("ARS 1.000.000", "Piso estatal general", "Referencia mínima inicial del escalafón general provincial; no representa una escala técnica específica.") },
  { id: "soporte-infraestructura", line: "D", color: lines.D.color, area: "Infraestructura & sistemas", title: "Tecnicatura Superior en Soporte de Infraestructura de Tecnologías de la Información", description: "Mantené redes, equipos y servicios digitales funcionando.", tags: ["technology", "infrastructure", "logic"], salary: itReference("ARS 1.200.000", "ARS 1.904.000", "Soporte IT · mediana bruta mensual", "Junior y senior de Soporte / Technical Support, jornada completa; encuesta de diciembre 2025–febrero 2026.", "Soporte IT · procesamiento de Sysarmy 2026.1") },
  { id: "ciencia-datos-ia", line: "D", color: lines.D.color, area: "Datos & futuro", title: "Tecnicatura Superior en Ciencias de Datos e Inteligencia Artificial", description: "Analizá información, automatizá procesos y explorá modelos de inteligencia artificial.", tags: ["technology", "data", "math", "logic"], salary: itReference("ARS 2.177.352", "ARS 4.800.000", "Científico/a de datos · mediana mensual", "Mediana bruta de Sysarmy 2026.1: 14 respuestas junior y 38 senior. Son referencias orientativas del sector IT, no garantía ni proyección nominal para 2030.", "Datos Sysarmy 2026.1 · cálculo publicado por Instituto IEA") },
];

export const questions = [
  {
    prompt: "¿Qué plan te atraparía un sábado?",
    hint: "Elegí lo que te da curiosidad, no lo que ya sabés hacer.",
    answers: [
      { title: "Explicar un tema o inventar un juego para enseñar", detail: "Aprender junto a otras personas.", lines: { A: 3 }, tags: { teaching: 2, people: 1, early: 1 } },
      { title: "Hacer un experimento o salir a observar la naturaleza", detail: "Entender qué pasa y por qué.", lines: { B: 3 }, tags: { science: 2, nature: 2, biology: 1, chemistry: 1 } },
      { title: "Organizar un torneo, un evento o un proyecto local", detail: "Mover ideas, equipos y procesos.", lines: { C: 3 }, tags: { sport: 1, organization: 2, business: 1, community: 1 } },
      { title: "Descubrir un patrón con datos y probar una herramienta", detail: "Convertir preguntas en soluciones digitales.", lines: { D: 3 }, tags: { technology: 2, data: 2, math: 1, infrastructure: 1 } },
    ],
  },
  {
    prompt: "Cuando aparece un desafío difícil, ¿por dónde empezás?",
    hint: "Pensá en tu primer impulso, no en la respuesta perfecta.",
    answers: [
      { title: "Escucho, explico y busco una forma de acompañar", detail: "Las soluciones empiezan con las personas.", lines: { A: 2 }, tags: { people: 2, community: 2, communication: 1, care: 1 } },
      { title: "Hago preguntas, comparo pistas y pruebo hipótesis", detail: "La evidencia me ayuda a entender.", lines: { B: 2, C: 1 }, tags: { science: 2, logic: 2, math: 1, physics: 1 } },
      { title: "Ordeno tareas y encuentro una manera más segura de hacerlas", detail: "Me gusta que las cosas funcionen mejor.", lines: { C: 2 }, tags: { organization: 2, safety: 2, industry: 1, business: 1 } },
      { title: "Busco datos, patrones o una herramienta que me ayude", detail: "Me atraen los sistemas y la tecnología.", lines: { D: 2, B: 1 }, tags: { technology: 2, data: 2, infrastructure: 1, logic: 1 } },
    ],
  },
  {
    prompt: "¿Qué problema de tu entorno te gustaría mejorar?",
    hint: "Imaginá un proyecto con impacto real en Jujuy o en el mundo.",
    answers: [
      { title: "Que más chicos y jóvenes encuentren oportunidades para aprender", detail: "Educación, comunicación y comunidad.", lines: { A: 3 }, tags: { teaching: 2, early: 1, communication: 1, community: 1 } },
      { title: "Entender mejor la salud, la naturaleza o el ambiente", detail: "Ciencia, territorio y sostenibilidad.", lines: { B: 2, C: 1 }, tags: { biology: 1, chemistry: 1, nature: 2, geography: 1, water: 1 } },
      { title: "Hacer más seguros y eficientes los espacios de trabajo", detail: "Procesos, industria y desarrollo local.", lines: { C: 3 }, tags: { safety: 2, industry: 2, organization: 1, chemistry: 1 } },
      { title: "Usar tecnología para anticipar problemas y tomar decisiones", detail: "Datos, algoritmos e inteligencia artificial.", lines: { D: 3 }, tags: { technology: 2, data: 2, math: 1, logic: 1 } },
    ],
  },
  {
    prompt: "¿Qué lugar te ayuda a dar lo mejor?",
    hint: "No define tu futuro: nos da otra pista sobre lo que te interesa.",
    answers: [
      { title: "Un aula, una biblioteca o un espacio comunitario", detail: "Ideas que se construyen en equipo.", lines: { A: 3 }, tags: { teaching: 2, language: 1, community: 1, people: 1 } },
      { title: "Un laboratorio, el campo o una salida de exploración", detail: "Observar, medir y descubrir.", lines: { B: 2, C: 1 }, tags: { science: 2, nature: 2, biology: 1, geography: 1, water: 1 } },
      { title: "Una cancha, una empresa o un lugar de producción", detail: "Acción, organización y resultados.", lines: { C: 3 }, tags: { sport: 1, business: 1, industry: 2, organization: 1 } },
      { title: "Una computadora conectada a una red de ideas", detail: "Herramientas digitales y proyectos globales.", lines: { D: 3 }, tags: { technology: 2, infrastructure: 1, data: 1, global: 1 } },
    ],
  },
  {
    prompt: "¿Qué aporte te gustaría llevar a un equipo?",
    hint: "Tus fortalezas pueden combinarse de muchas maneras.",
    answers: [
      { title: "Explicar algo complejo con palabras claras", detail: "Enseñar, comunicar, escuchar.", lines: { A: 2 }, tags: { teaching: 2, language: 2, communication: 2, people: 1 } },
      { title: "Medir, experimentar y encontrar una explicación", detail: "Ciencias, números y preguntas nuevas.", lines: { B: 2 }, tags: { science: 2, math: 2, chemistry: 1, physics: 1, biology: 1 } },
      { title: "Coordinar tareas y cuidar que todo salga bien", detail: "Procesos, seguridad y colaboración.", lines: { C: 2 }, tags: { organization: 2, safety: 1, business: 1, care: 1, sport: 1 } },
      { title: "Automatizar una tarea o hacer visible un patrón", detail: "Datos, lógica e infraestructura tecnológica.", lines: { D: 2 }, tags: { technology: 2, data: 2, logic: 2, infrastructure: 1 } },
    ],
  },
];

export type MetroResult = {
  lineScores: Record<LineId, number>;
  interestScores: Record<string, number>;
  ranking: Array<{ id: string; score: number }>;
  focusLine: LineId;
};

export type SavedMetroTicket = {
  name: string;
  answers: Answers;
  result: MetroResult;
  selectedCourseId?: string;
  createdAt?: string;
};

export function buildMetroResult(answers: Answers): MetroResult {
  const lineScores: Record<LineId, number> = { A: 0, B: 0, C: 0, D: 0 };
  const interestScores: Record<string, number> = {};
  answers.forEach((answerIndex, questionIndex) => {
    const option = questions[questionIndex]?.answers[answerIndex];
    if (!option) return;
    Object.entries(option.lines).forEach(([line, score]) => { lineScores[line as LineId] += score; });
    Object.entries(option.tags).forEach(([tag, score]) => { interestScores[tag] = (interestScores[tag] || 0) + score; });
  });
  const ranking = careers.map((career, index) => {
    const topicScore = career.tags.reduce((sum, tag) => sum + (interestScores[tag] || 0), 0) / career.tags.length;
    return { id: career.id, score: Number((lineScores[career.line] * 2 + topicScore).toFixed(2)), index };
  }).sort((a, b) => b.score - a.score || a.index - b.index).map(({ id, score }) => ({ id, score }));
  const focusLine = (Object.entries(lineScores).sort((a, b) => b[1] - a[1])[0]?.[0] || "A") as LineId;
  return { lineScores, interestScores, ranking, focusLine };
}

export function getCareer(id: string): Career {
  return careers.find(career => career.id === id) || careers[0];
}

export function getTopCareers(result: MetroResult, count = 3): Career[] {
  return result.ranking.slice(0, count).map(item => getCareer(item.id));
}
