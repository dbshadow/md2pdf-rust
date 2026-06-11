# pdf-preview Specification

## Purpose
TBD - created by archiving change local-markdown-to-pdf-converter. Update Purpose after archive.
## Requirements
### Requirement: Interactive PDF Live Preview
The system SHALL display the generated PDF document inside an embedded preview container in the frontend UI.

#### Scenario: PDF buffer is loaded
- **WHEN** the frontend receives the compiled PDF blob from the Rust backend via Tauri IPC
- **THEN** it SHALL update the preview container using a Blob Object URL to show the PDF document inline

### Requirement: Export Generated PDF
The system SHALL allow the user to download the generated PDF to their local machine.

#### Scenario: User clicks download button
- **WHEN** the user clicks the "Download PDF" button
- **THEN** the system SHALL open a native save file dialog to let the user save the PDF file locally

