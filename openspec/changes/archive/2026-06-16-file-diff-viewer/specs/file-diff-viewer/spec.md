## ADDED Requirements

### Requirement: Toggle Side-by-Side Diff View
The system SHALL provide a "Compare Changes" tab in the left-side editor panel that switches the editor into a side-by-side diff view.

#### Scenario: Switching to compare changes tab
- **WHEN** the user selects the "Compare Changes" tab
- **THEN** the system SHALL display Monaco's DiffEditor showing the original saved content on the left and the modified content on the right, keeping the right-side preview aligned with the modified text

### Requirement: Block-level Revert
The system SHALL support block-level revert operations within the diff view to let users discard specific change blocks and restore original contents.

#### Scenario: User clicks revert button on a change block
- **WHEN** the user clicks the revert arrow in the margin next to a modified block
- **THEN** the system SHALL restore the original text for that block inside the modified panel and synchronize changes back to the active markdown editor state
