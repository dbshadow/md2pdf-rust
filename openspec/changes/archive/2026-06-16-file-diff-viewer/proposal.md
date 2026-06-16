## Why

Currently, when users edit Markdown files locally in md2pdf, they cannot easily track what lines have been added, removed, or modified compared to the saved state on their disk. Introducing a native side-by-side diff viewer provides safety, reviewability, and block-level revert operations before saving, dramatically improving the document editing experience.

## What Changes

- **Diff View Toggle**: Add a "Compare Changes" tab in the left-side editor panel. Switching to this tab swaps the standard editor with Monaco's side-by-side DiffEditor.
- **Save-State Comparison**: The original panel (left) shows the document as stored on disk (or the default template for unsaved drafts), while the modified panel (right) displays current edits.
- **Live Edit in Diff**: Support direct editing within the modified pane of the diff viewer, with the live HTML preview updating instantly.
- **One-click Block Revert**: Enable Monaco's margin revert buttons to allow users to discard specific change blocks and restore original content with a single click.

## Capabilities

### New Capabilities
- `file-diff-viewer`: Side-by-side diff comparison mode against the saved disk state with support for block-level revert controls.

### Modified Capabilities
<!-- None -->

## Impact

- **Frontend (`src/App.tsx`)**: Injects Monaco `<DiffEditor>`, tracks an `originalMarkdown` state (synced upon open, save, template switch, and reset), and manages UI tab transitions.
