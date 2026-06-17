## Why

Currently, the workspace is always split between the editor panel and the preview panel. When users work in "Compare Changes" (Diff View) mode, the horizontal space is divided into three narrow columns, making editing cramped and difficult. Allowing users to toggle the visibility of the preview panel resolves this limitation and offers a full-width focus mode.

## What Changes

- **Preview Visibility State**: Manage the visibility of the preview panel using a React state.
- **Toggle Preview Button**: Add a toolbar button to show/hide the preview panel with tooltips and dynamic icons.
- **Responsive Layout Adaptation**: Adjust the editor panel width dynamically to 100% when preview is hidden, and hide the resizer bar during this state.

## Capabilities

### New Capabilities
- `toggle-preview-pane`: Toggleable preview layout allowing users to collapse the right-side preview panel to focus on Markdown editing and Diff comparisons in a full-width container.

### Modified Capabilities
<!-- None -->

## Impact

- **Frontend (`src/App.tsx`)**: Manages `showPreview` visibility state, injects the toggle button in the header toolbar, and adjusts editor-panel, resizer-bar, and preview-panel rendering styles.
