# md2pdf 🚀

[README_zh.md (繁體中文)](README_zh.md) | [README.md (English)](README.md) | [README_es.md (Español)](#)

---

## 📖 Introducción

`md2pdf` es una hermosa aplicación de escritorio independiente y orientada a la privacidad para **convertir Markdown a PDF localmente**. Desarrollada con Tauri (Rust) + React + TypeScript, utiliza Monaco Editor para ofrecer una experiencia de edición eficiente y emplea un navegador headless persistente (Microsoft Edge/Chrome) en Rust para generar PDFs en formato A4 con alta precisión.

Todas las operaciones se procesan de forma local, garantizando el 100% de la privacidad y seguridad de sus datos.

---

## ✨ Características Principales

*   **Integración de editor dual**: Equipado con Monaco Editor (el motor detrás de VS Code) tanto para Markdown como para CSS, con soporte para resaltado de sintaxis, números de línea, autocompletado y análisis de errores.
*   **Editor de diferencias (Diff Editor)**: Permite activar el modo Diff Editor de Monaco para comparar visualmente las diferencias de código entre su borrador actual y la plantilla.
*   **Guardado de plantillas personalizadas**: Guarde el contenido de Markdown editado y las hojas de estilo CSS como plantillas personalizadas en su equipo para aplicarlas con un solo clic.
*   **Sistema de vista previa dual**:
    *   **Vista previa instantánea en HTML**: Respuesta a nivel de microsegundos al escribir, sin parpadeos y conservando la posición de desplazamiento para una escritura fluida.
    *   **Vista previa de impresión real en PDF**: Cambie para renderizar su PDF A4 a través del navegador headless interno, mostrando márgenes exactos, saltos de página y reglas `@page` de CSS.
*   **Estilos predefinidos de alta calidad**:
    *   📄 **Resume (Currículum)**: Diseño compacto y profesional, ideal para buscar empleo.
    *   🎓 **Academic (Académico)**: Formateado con márgenes estándar y sangría académica.
    *   🚀 **Modern (Moderno)**: Hermosos degradados en títulos y bloques de código con esquinas redondeadas.
    *   💎 **Tiffany Minimal (Tiffany Mínimo)**: Diseño elegante con tonos verde Tiffany y azul grisáceo Morandi.
    *   📝 **Plain Markdown (Texto Plano)**: Un diseño clásico, minimalista y puro.
    *   📘 **Tech Blue (Azul Tecnológico)**: Diseño azul profesional, optimizado para diagramas Mermaid y prevención de saltos de página incorrectos.
*   **Diálogo nativo para guardar archivos**: Al descargar el PDF, se invoca el diálogo nativo del sistema operativo, permitiéndole elegir la ruta y el nombre del archivo de forma segura.
*   **Panel lateral de configuración (Drawer)**：
    *   Permite alternar entre el modo Oscuro/Claro (Dark/Light Mode) de forma global.
    *   Soporte para múltiples idiomas (Chino tradicional, Inglés, etc.).
    *   Permite activar/desactivar la opción "Buscar actualizaciones al iniciar" (estado persistido en `localStorage`).
*   **Actualizador automático en línea**: Verifica automáticamente nuevas versiones en segundo plano al iniciar, muestra el progreso de descarga y se reinicia de manera automática y fluida al finalizar.

---

## 💻 Plataformas Soportadas

*   **Windows**: Ejecutable independiente y portátil (`.exe`).
*   **macOS**: Paquete universal (`_universal.dmg` compatible con procesadores Intel y Apple Silicon M).

---

## 🍎 Instrucciones de instalación y seguridad para macOS

Debido a que el instalador de macOS (`_universal.dmg`) se distribuye sin firmar, el mecanismo de seguridad de macOS (Gatekeeper) bloqueará su ejecución la primera vez. Puede desbloquearlo de forma segura mediante cualquiera de los siguientes métodos:

### Método 1: Clic derecho en Finder (Recomendado)
1.  Abra el **Finder** y vaya a la carpeta **Aplicaciones**.
2.  Busque `md2pdf`, mantenga presionada la tecla **`Control` y haga clic** en la aplicación (o haga clic derecho) y elija **Abrir**.
3.  En la ventana de advertencia que aparece, haga clic en el botón **Abrir**. A partir de ese momento, podrá iniciarla con un doble clic normal.

### Método 2: Desbloqueo por Terminal (El más rápido)
Abra la aplicación **Terminal** en su Mac y ejecute el siguiente comando para eliminar la etiqueta de cuarentena del sistema:
```bash
xattr -cr /Applications/md2pdf.app
```

---

## 🛠️ Requisitos Previos

### Requisitos del sistema
*   Node.js >= 18
*   Rust y el conjunto de herramientas de Cargo (para compilar el backend de Rust)

---

## 🚀 Pasos de Desarrollo y Ejecución

### 1. Instalar dependencias
Ejecute el siguiente comando en el directorio raíz del proyecto:
```bash
npm install
```

### 2. Iniciar el entorno de desarrollo
```bash
npm run dev
```
Esto compilará el backend de Rust, iniciará el servidor de desarrollo de Vite y abrirá la ventana de escritorio de Tauri.

---

## 📦 Compilación y Publicación (Build)

Puede empaquetar la aplicación en un ejecutable listo para su distribución:

### Plataforma Windows
```bash
# Empaquetar con NSIS en un archivo ejecutable portátil .exe
npx @tauri-apps/cli build
```
Una vez finalizado, el instalador se generará en la siguiente ruta:
`src-tauri/target/release/bundle/nsis/md2pdf_{version}_x64-setup.exe`

### Plataforma macOS
```bash
# Empaquetar en un instalador universal para macOS
npx @tauri-apps/cli build --target universal-apple-darwin
```
Una vez finalizado, el archivo DMG se generará en la siguiente ruta:
`src-tauri/target/universal-apple-darwin/release/bundle/dmg/md2pdf_{version}_universal.dmg`

---

## 📄 Licencia

Distribuido bajo la **[Licencia MIT](LICENSE)**.
