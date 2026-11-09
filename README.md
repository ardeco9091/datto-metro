# Datto-Metro

**Un recorrido interactivo para explorar las carreras del IES N.º 9 Juana Azurduy.**

Datto-Metro convierte la orientación académica en un mapa de cuatro líneas y 18 carreras. A partir de cinco situaciones breves, presenta afinidades y posibles caminos para que cada estudiante explore la oferta educativa del Instituto.

**[Abrir la demo pública](https://dato-metro.vercel.app/dattometro)** · Hecho para la Expo del IES N.º 9 · Jujuy, Argentina

## El proyecto

Elegir qué estudiar puede sentirse como tener que encontrar una única respuesta. Datto-Metro propone otra entrada: responder desde los intereses, ver varias rutas posibles y conocer el catálogo completo antes de elegir qué carrera llevarse en una tarjeta.

La metáfora del metro organiza la oferta en cuatro líneas:

| Línea | Área | Carreras |
| --- | --- | ---: |
| A | Educación y Ciencias Sociales | 7 |
| B | Ciencias Exactas y Naturales | 4 |
| C | Deporte, Industria y Gestión | 5 |
| D | Tecnología, Innovación e IA | 2 |

La Tecnicatura Superior en Ciencias de Datos e Inteligencia Artificial se destaca como una propuesta del Instituto y como tema para conversar sobre las herramientas que pueden complementar distintos campos profesionales.

## Recorrido

1. El pasajero puede ingresar un nombre o alias y responde cinco preguntas situacionales.
2. La aplicación procesa las respuestas y muestra afinidades entre las cuatro líneas.
3. Presenta tres carreras sugeridas y permite explorar y elegir entre las 18 carreras.
4. Muestra referencias salariales con aclaraciones sobre su alcance y fuentes.
5. Genera una tarjeta digital compartible mediante QR o una tarjeta imprimible. La impresión está preparada para usar dos tarjetas por hoja A4, también en dos momentos distintos.

## Cómo se calculan las afinidades

El recomendador usa un sistema de puntajes explícito, no un modelo de inteligencia artificial. Cada respuesta suma puntos a una o más líneas y a etiquetas temáticas, como enseñanza, comunidad, ciencia, organización, datos o tecnología. Para cada carrera, se combina el puntaje de su línea con la coincidencia de sus etiquetas; luego se ordenan las carreras y se muestran las tres primeras.

El resultado es exploratorio: no diagnostica aptitudes, no decide por el estudiante y no pretende reemplazar la orientación vocacional.

## Referencias salariales

Los importes son referencias orientativas y no una promesa ni una predicción nominal para 2030. Para carreras asociadas a escalafones públicos se muestran referencias salariales provinciales generales o docentes; para perfiles tecnológicos se usan datos de encuestas sectoriales. La muestra, el rol, la experiencia, el empleador, el convenio y la fecha influyen en los valores.

La aplicación enlaza las fuentes correspondientes desde cada ficha. Entre las referencias utilizadas están [Gobierno de Jujuy](https://prensa.jujuy.gob.ar/gobierno-jujuy/el-gobierno-jujuy-acepto-la-contrapropuesta-del-6-y-garantiza-elevar-1-millon-el-salario-inicial-estatal-n125168), [Sysarmy](https://sysarmy.com/blog/posts/resultados-de-la-encuesta-de-sueldos-2026-1/), [Coderhouse](https://www.coderhouse.com/coderlibrary/cuanto-gana-un-tecnico-de-soporte-it-argentina) e [Instituto IEA](https://institutoiea.edu.ar/publicaciones/que-hace-un-analista-de-datos-y-cuanto-gana).

## Privacidad

- El recorrido se conserva en el almacenamiento de sesión del navegador; la aplicación no requiere una cuenta ni una base de datos para generar el resultado.
- El QR contiene los datos necesarios para reconstruir la tarjeta, incluidos el nombre o alias elegido, la carrera seleccionada y las respuestas. No se usa un servidor para guardar el perfil, pero cualquier persona con el enlace del QR puede abrir esa tarjeta.
- El nombre es opcional. Para la Expo se recomienda usar un alias y no ingresar información personal sensible.

## Tecnologías

- **Next.js** con App Router
- **React** y **TypeScript**
- Estilos escritos como objetos inline en JSX
- Paquete `qrcode` para generar códigos QR en el navegador
- **Vercel** para la demo pública

## Ejecutar localmente

Requisitos: Node.js y npm.

```bash
npm install
npm run dev
```

Abrí [http://localhost:3300](http://localhost:3300). Para generar una compilación de producción:

```bash
npm run build
npm start
```

## Rutas principales

| Ruta | Función |
| --- | --- |
| `/dattometro` | Ingreso y cuestionario |
| `/dattometro-processing` | Transición de cálculo de afinidades |
| `/dattometro-result` | Afinidades, carreras, referencias salariales y acciones |
| `/dattometro-card` | Tarjeta digital y preparación de impresión |
| `/dattometro-sheet` | Hoja de impresión con una o dos tarjetas |

## Estructura

```text
app/                  Rutas y pantallas de Next.js
components/           Componentes reutilizables, incluida la tarjeta
lib/                  Catálogo, puntajes, salarios y formato de QR
```

---

Proyecto interactivo para la Expo del **Instituto de Educación Superior N.º 9 Juana Azurduy**, Jujuy, Argentina.
