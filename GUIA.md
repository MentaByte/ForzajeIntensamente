# Guía del proyecto "Forzaje Intensamente"

Esta guía está pensada para alguien que **nunca ha usado GitHub** ni ha
desarrollado una **PWA (Progressive Web App)**. Explica qué hace cada archivo
del repositorio y algunos conceptos básicos para que puedas moverte con
confianza.

---

## 1. ¿Qué es este proyecto?

Es una pequeña aplicación web (una sola página) que muestra una galería de
imágenes a pantalla completa, con un "efecto sorpresa": si tocas la pantalla
varias veces seguidas (un "umbral" configurable), aparece una imagen especial
en pantalla completa con vibración. Está pensada para poder **instalarse en
el móvil como si fuera una app nativa**, gracias a que es una PWA.

---

## 2. Conceptos básicos antes de empezar

### ¿Qué es Git?
Git es un programa que guarda el **historial de cambios** de tus archivos.
Cada vez que guardas un avance, creas un "commit" (una fotografía del
proyecto en ese momento). Así puedes ver qué cambió, cuándo y por qué, e
incluso volver atrás si algo se rompe.

### ¿Qué es GitHub?
GitHub es una web que **aloja repositorios Git** en la nube. Permite:
- Guardar tu código de forma remota (backup).
- Colaborar con otras personas.
- Ver el historial de cambios (commits).
- Usar "Pull Requests" (propuestas de cambio) y "Issues" (incidencias/tareas).

### ¿Qué es un repositorio?
Es simplemente la **carpeta del proyecto** con todo su historial de cambios.
Este repositorio se llama `ForzajeIntensamente`.

### ¿Qué es una rama (branch)?
Es una "copia paralela" del proyecto donde puedes hacer cambios sin afectar
la versión principal (normalmente llamada `main`). Cuando terminas, puedes
fusionar (`merge`) esos cambios a la rama principal.

### ¿Qué es una PWA (Progressive Web App)?
Es una página web que se comporta como una app instalable:
- Tiene un icono y puede abrirse desde el escritorio o el móvil.
- Puede funcionar sin conexión (offline) usando un "Service Worker".
- Se define mediante un archivo `manifest.json` que le dice al navegador
  cómo debe instalarse (nombre, icono, colores, orientación, etc).

---

## 3. Archivos del repositorio, uno por uno

### `index.html`
Es el **único archivo de código** del proyecto. Contiene todo: HTML, CSS
(estilos) y JavaScript (la lógica), todo junto en un solo archivo. Se divide
en tres partes:

1. **`<head>`** (líneas 1-11): metadatos de la página, el título, y el enlace
   al `manifest.json` que convierte la web en instalable como PWA.

2. **`<style>`** (CSS, líneas 12-308): define cómo se ve todo:
   - `.gallery-container` / `.gallery`: la galería de imágenes con scroll
     "snap" (se ajusta imagen por imagen al deslizar), vertical por defecto
     u horizontal si se activa esa opción.
   - `#touchCounter`: el contador de toques que aparece abajo a la izquierda.
   - `#fullScreenImage`: la imagen sorpresa que se muestra a pantalla
     completa al alcanzar el umbral de toques.
   - `#installButton`: el botón "Instalar App".
   - `#settingsBtn`, `#settingsPanel`, `#settingsOverlay`: el botón de
     engranaje (⚙️) y el panel lateral de configuración (toggles, sliders).

3. **`<body>` + `<script>`** (JavaScript, líneas 310-725): la lógica de la
   app:
   - **Lista de imágenes** (`IMAGES`): los 9 archivos `.jpg` de emociones
     que se muestran en la galería.
   - **Settings** (ajustes): se guardan en `localStorage` del navegador
     (persisten aunque cierres la app) bajo la clave `fi-settings`. Incluyen
     umbral de toques, vibración, pantalla completa automática, orientación
     horizontal/vertical, mostrar contador, y opacidad del botón.
   - **Galería infinita**: clona las imágenes 3 veces (`[clones][originales]
     [clones]`) y al hacer scroll hasta los extremos "salta" silenciosamente
     al centro, dando la sensación de scroll infinito.
   - **Panel de configuración**: abre/cierra un panel lateral donde se
     pueden cambiar los ajustes en tiempo real.
   - **Contador de toques**: cada toque en la pantalla (fuera del panel de
     ajustes) suma 1. Al llegar al umbral configurado, se muestra la imagen
     sorpresa a pantalla completa, vibra el móvil (si está permitido) y
     entra en modo pantalla completa.
   - **Botón de instalación**: usa el evento `beforeinstallprompt` del
     navegador para ofrecer instalar la PWA con un botón propio.
   - **Registro del Service Worker**: intenta registrar `./sw.js` para
     habilitar funcionalidad offline (ver nota más abajo, este archivo no
     existe todavía en el repo).

### `manifest.json`
Es el archivo que **convierte la página web en una PWA instalable**. Le dice
al navegador:
- `name` / `short_name`: el nombre completo y corto de la app.
- `start_url` / `scope`: desde dónde arranca la app y qué rutas controla.
- `display: "standalone"`: que se abra sin la barra de direcciones del
  navegador, como una app nativa.
- `orientation: "portrait"`: que se fuerce la orientación vertical.
- `background_color` / `theme_color`: colores de la pantalla de carga y la
  barra de estado.
- `icons`: los iconos que se usan al instalar la app (apunta a
  `icon-192x192.png` e `icon-512x512.png`).

### Imágenes de emociones (`ABURRIMIENTO.jpg`, `ALEGRIA.jpg`, `ANSIEDAD.jpg`,
`DESAGRADO.jpg`, `ENVIDIA.jpg`, `FURIA.jpg`, `MIEDO.jpg`, `TRISTEZA.jpg`,
`VERGUENZA.jpg`)
Son las 9 fotos que forman la galería principal, referenciadas en el array
`IMAGES` dentro de `index.html`.

### `FORZAJE.jpg` y `FORZAJEVERTICAL.jpg`
Son las imágenes "sorpresa" que aparecen a pantalla completa cuando se
alcanza el umbral de toques. `FORZAJEVERTICAL.jpg` no está actualmente
referenciada en el código (el script usa `DESAGRADO.jpg` en modo vertical y
`FORZAJE.jpg` en modo horizontal — ver función `applyOrientation()`).

### `icon-192x192.png` / `icon-512x512.png`
Son los iconos de la app en dos tamaños, usados por `manifest.json` para
mostrarse en el escritorio/móvil cuando se instala la PWA.

---

## 4. Algo a tener en cuenta

El código de `index.html` intenta registrar un Service Worker en
`./sw.js` (línea 708), pero **ese archivo no existe en el repositorio**. Esto
significa que, por ahora, la app no tiene soporte offline real: el
`console.log('Error SW:', err)` se disparará silenciosamente en la consola
del navegador sin afectar al resto de la app (el `catch` evita que rompa
nada), pero la PWA seguirá siendo instalable gracias al `manifest.json`
aunque sin caché offline.

---

## 5. Cómo se relaciona todo (flujo resumido)

1. El navegador carga `index.html`.
2. Lee el `<link rel="manifest">` y usa `manifest.json` para saber cómo
   ofrecer la instalación de la PWA (icono, nombre, colores).
3. El JavaScript construye la galería con las imágenes de emociones.
4. El usuario desliza la galería; cada toque en pantalla suma al contador.
5. Al llegar al umbral configurado, se muestra la imagen sorpresa
   (`DESAGRADO.jpg` o `FORZAJE.jpg`, según orientación) a pantalla completa.
6. El usuario puede ajustar el comportamiento desde el panel de
   configuración (⚙️), y esos ajustes se guardan en el propio navegador.
