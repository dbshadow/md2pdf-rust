## ADDED Requirements

### Requirement: Header and Footer Configuration UI
The system SHALL provide configuration controls in the Settings Drawer to enable or disable headers/footers and customize header text, footer text, and page numbering format.

#### Scenario: User toggles header and footer display
- **WHEN** user enables the "Header & Footer" toggle switch in Settings Drawer
- **THEN** system SHALL display inputs for header text, footer text, and page number style options, persisting choices in localStorage

#### Scenario: User inputs custom dynamic variables
- **WHEN** user types `{{page}}`, `{{totalPages}}`, `{{title}}`, or `{{date}}` into header or footer input fields
- **THEN** system SHALL dynamically replace these placeholders with real-time document values during PDF preview and export

### Requirement: PDF Header and Footer Rendering
The system SHALL render customized headers and footers with page numbers on every exported PDF page according to the user's configuration.

#### Scenario: Exporting PDF with dynamic page numbers
- **WHEN** user exports a PDF document with footer text set to "Page {{page}} of {{totalPages}}"
- **THEN** every page of the generated PDF SHALL contain the evaluated page numbers in the bottom footer region
