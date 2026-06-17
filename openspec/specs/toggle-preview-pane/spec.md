# toggle-preview-pane Specification

## Purpose
提供一鍵顯示或隱藏右側預覽面板的功能。在預覽面板被隱藏時，編輯器/對比面板會自動擴展至 100% 寬度，以提供專注寫作與程式碼對比空間，優化在窄螢幕下的排版視覺。
## Requirements
### Requirement: Toggle preview visibility
The system SHALL provide a "Toggle Preview" button in the application toolbar that collapses or expands the right-side preview panel.

#### Scenario: Hide the preview panel
- **WHEN** the user clicks the "Toggle Preview" button when preview is visible
- **THEN** the system SHALL hide the right-side preview panel and the draggable resizer bar, expanding the left-side editor panel to full width (100%)

#### Scenario: Show the preview panel
- **WHEN** the user clicks the "Toggle Preview" button when preview is hidden
- **THEN** the system SHALL restore the right-side preview panel and the resizer bar, recovering the previous editor width percentage

