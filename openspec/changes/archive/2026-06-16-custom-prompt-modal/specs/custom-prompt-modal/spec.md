## ADDED Requirements

### Requirement: Custom input prompt modal
The system SHALL display a customized HTML modal overlay instead of browser native dialogs for prompt inputs, removing any browser origin headers.

#### Scenario: Prompting user for template name
- **WHEN** the user triggers the "Save Template" action
- **THEN** the system SHALL render a custom modal overlay with backdrop blur and auto-focused input box

### Requirement: Modal interaction and submission
The system SHALL support modal submission (on clicking confirm or pressing Enter) and modal cancellation (on clicking cancel, overlay click, or pressing Escape).

#### Scenario: Submitting template name via input modal
- **WHEN** the user inputs a name and presses Enter or clicks confirm
- **THEN** the system SHALL close the modal, pass the input back to the template saving function, and resolve the action
