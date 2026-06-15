## Why

Currently, the application only supports importing preset templates and typing directly in the editor, forcing users to manually copy and paste content if they want to save changes back to their original Markdown files. Adding native file read and write support creates a seamless, complete local editing and PDF compiling workflow.

## What Changes

- **Open File**: Users can open local `.md` or `.markdown` files using a native open dialog. The editor's content will be populated, and the current file path will be tracked.
- **Save File**: Users can save changes back to the currently opened file path directly (via `Ctrl+S` or UI button). If editing a new document, it falls back to "Save As".
- **Save As**: Users can save the current editor content to a new path via a native save dialog.
- **Relative Image Resolution Upgrade (BREAKING)**: Modify the relative image resolution base directory. If a file is opened, any relative image paths (e.g., `![alt](./image.png)`) will be resolved relative to the *opened Markdown file's directory* instead of the application executable's directory.

## Capabilities

### New Capabilities
- `file-system-editor`: Native file open/save dialogs, reading file contents, and writing contents back to the local host filesystem.

### Modified Capabilities
- `pdf-generator`: Upgrade HTML/PDF compilation commands (`parse_markdown`, `generate_pdf`) to accept an optional `base_dir` parameter, specifying the directory context for resolving local relative image paths.

## Impact

- **Frontend**: `src/App.tsx` (UI buttons, shortcut bindings, dialog calls, tracking current file path and save states).
- **Backend**: `src-tauri/src/lib.rs` (new tauri commands for file reading/writing, and updating `parse_markdown` and `generate_pdf` signatures/logic to support base directory context).
- **Plugins**: Re-verify capabilities configuration for `@tauri-apps/plugin-dialog` to ensure correct permissions.
