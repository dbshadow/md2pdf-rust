## ADDED Requirements

### Requirement: Toggle preview visibility
The system SHALL provide a "Toggle Preview" button in the application toolbar that collapses or expands the right-side preview panel.

#### Scenario: Hide the preview panel
- **WHEN** the user clicks the "Toggle Preview" button when preview is visible
- **THEN** the system SHALL hide the right-side preview panel and the draggable resizer bar, expanding the left-side editor panel to full width (100%)

#### Scenario: Show the preview panel
- **WHEN** the user clicks the "Toggle Preview" button when preview is hidden
- **THEN** the system SHALL restore the right-side preview panel and the resizer bar, recovering the previous editor width percentage
