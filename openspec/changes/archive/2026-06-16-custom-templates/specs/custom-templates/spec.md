## ADDED Requirements

### Requirement: Save custom template
The system SHALL provide a "Save as Template" button that prompts the user for a name and saves the current Markdown and CSS stylesheet as a custom template.

#### Scenario: Save current layout as a custom template
- **WHEN** the user clicks "Save as Template" and inputs a valid template name
- **THEN** the system SHALL create a template entry with a unique ID prefixed with "custom_", store it inside localStorage, and dynamically update the template selection dropdown

### Requirement: Delete custom template
The system SHALL allow the user to delete any custom template. The delete action SHALL only be visible when a custom template is currently selected.

#### Scenario: Delete currently selected custom template
- **WHEN** the user clicks "Delete Template" and confirms the action
- **THEN** the system SHALL remove the template from localStorage, reset the active template to the default preset template, and reload the default template contents
