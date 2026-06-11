## ADDED Requirements

### Requirement: Preset Theme Selection
The system SHALL provide a list of predefined CSS styles (themes) representing different use cases (e.g., Resume, Academic Paper, Letter, Plain).

#### Scenario: User selects a preset theme
- **WHEN** the user selects a preset theme from the dropdown menu
- **THEN** the CSS editor content SHALL be replaced by the CSS rules of the selected theme and a preview update SHALL be triggered

### Requirement: Template Reset
The system SHALL allow users to revert or clear their customizations back to the template's baseline.

#### Scenario: User resets style
- **WHEN** the user clicks the "Reset to Template" button
- **THEN** the CSS editor SHALL restore the default styling of the currently selected template
