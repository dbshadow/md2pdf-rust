## ADDED Requirements

### Requirement: Interactive PDF Live Preview
The system SHALL display the generated PDF document inside an embedded preview container in the frontend UI.

#### Scenario: PDF buffer is loaded
- **WHEN** the frontend receives the compiled PDF blob from the backend
- **THEN** it SHALL update the preview container using an Object URL (blob URL) to show the PDF document inline

### Requirement: Export Generated PDF
The system SHALL allow the user to download the generated PDF to their local machine.

#### Scenario: User clicks download button
- **WHEN** the user clicks the "Download PDF" button
- **THEN** the browser SHALL download the PDF file with the specified filename or a default timestamped filename
