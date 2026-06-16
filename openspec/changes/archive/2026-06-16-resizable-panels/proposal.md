## Why

Currently, the left-side editor/diff panel and the right-side preview panel have fixed 50% widths. When users open the diff view (which displays code side-by-side), the workspace becomes cramped and hard to read. Allowing users to drag and dynamically resize the panels solves this layout constraint and improves ergonomics.

## What Changes

- **Splitter/Resizer Control**: Add a draggable resizer bar between the left editor panel and the right preview panel.
- **Dynamic Width States**: Implement mouse interaction handlers to adjust panel widths dynamically.
- **UX Drag Overlays**: Prevent the iframe preview from stealing pointer events during drag actions to ensure a smooth resizing experience.

## Capabilities

### New Capabilities
- `resizable-panels`: A draggable splitter layout allowing users to adjust the width proportion of the left editor panel and right preview panel dynamically.

### Modified Capabilities
<!-- None -->

## Impact

- **Frontend (`src/App.tsx`)**: Injects resizer elements, manages panel width percentage state, and coordinates mouse move/up events with drag overlay flags.
- **Styling (`src/index.css`)**: Adjusts `.editor-panel` and `.preview-panel` styles to respect dynamic width styles, and style the splitter component with hover interactions.
