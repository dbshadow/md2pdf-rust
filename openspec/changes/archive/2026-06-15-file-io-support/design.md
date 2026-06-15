## Context

Currently, md2pdf runs locally as a Tauri desktop app but lacks basic file-system read and write interactions. In addition, local image resolution is anchored to the application executable directory, preventing users from rendering relative images correctly when opening documents from arbitrary folders on their system.

## Goals / Non-Goals

**Goals:**
- Implement "Open File", "Save File", and "Save As" in the UI with native file dialogues.
- Track current file path and unsaved changes state (showing a `*` indicator next to the filename when dirty).
- Refactor the Rust backend to resolve Markdown images relative to the active file directory when a file is open.
- Set up global keyboard shortcuts (`Ctrl+S`, `Ctrl+O`, `Ctrl+Shift+S`) for rapid workflow.

**Non-Goals:**
- Multi-tab document editing (only one active document in the editor).
- Autosave functionality.
- File system watchers (detecting changes made externally to the file).

## Decisions

### Decision 1: Custom Rust commands for reading and writing text files
Instead of setting up the official `@tauri-apps/plugin-fs` plugin which requires verbose capabilities configuration in Tauri v2, we will implement custom Tauri commands in Rust (`read_text_file` and `write_text_file`).
- **Rationale**: Keeps frontend logic simple, secures file access within Rust, and avoids complex capabilities permissions management.
- **Alternative**: Using `@tauri-apps/plugin-fs`. Rejected due to setup overhead and runtime permission debugging complexity on Windows WSL environment.

### Decision 2: Contextual image resolution (`base_dir`)
We will refactor `parse_markdown` and `generate_pdf` Tauri commands to accept an optional `base_dir: Option<String>` parameter.
- **Rationale**: When a document is loaded from `D:\docs\note.md`, the frontend extracts the directory `D:\docs\` and passes it as `base_dir`. The Rust backend then combines this directory context with relative image paths using `std::path::Path::join`, preserving standard OS path separator conventions.
- **Alternative**: Passing absolute image paths from frontend. Rejected because it breaks standard markdown formatting (`![alt](./img.png)`) when editing.

## Risks / Trade-offs

- **[Risk] Windows path formatting inside WSL development**: Path formatting between Windows host (Tauri runtime) and WSL (development context) might differ.
  - *Mitigation*: Use Rust's `Path` and `PathBuf` for all backend path logic, which handles Windows backslashes (`\`) and Unix slashes (`/`) natively based on compilation target.
- **[Risk] Discarding unsaved changes**: Users might lose work if they switch templates or open a new file without saving.
  - *Mitigation*: Implement a confirmation prompt (`confirm` from Tauri plugin-dialog or window.confirm) if the editor has unsaved changes before performing operations that overwrite current state.
