# resizable-panels Specification

## Purpose
提供可水平拖曳的雙欄分割版面（Splitter Layout），讓使用者可自由調整左側編輯器/對比面板與右側預覽面板之寬度比例，優化視窗使用空間與編輯體驗。
## Requirements
### Requirement: Draggable splitter layout
The system SHALL render a draggable resizer bar between the left-side editor panel and the right-side preview panel, allowing users to dynamically adjust the horizontal layout proportion.

#### Scenario: Adjusting width by dragging resizer
- **WHEN** the user mouse downs on the resizer bar and drags horizontally
- **THEN** the system SHALL calculate the width percentage and apply it to the panels dynamically, triggering automatic layout adjustments for Monaco Editor/DiffEditor

### Requirement: Drag overlay for iframe preview
The system SHALL prevent the right-side iframe preview from intercepting mouse pointer events during resizing actions, ensuring smooth and uninterrupted drag operations.

#### Scenario: Pointer event bypassing during drag
- **WHEN** a dragging operation is active on the resizer bar
- **THEN** the system SHALL temporarily disable pointer-events on the preview iframe and restore them immediately once the drag ends (mouse up)

