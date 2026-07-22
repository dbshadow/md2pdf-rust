## ADDED Requirements

### Requirement: Extended PDF Generation Command Parameters
The system SHALL accept header and footer HTML templates or configuration objects when invoking the PDF generation IPC command.

#### Scenario: Rust backend receives header and footer config
- **WHEN** frontend calls `generate_pdf` IPC command with header and footer parameters
- **THEN** Rust headless browser SHALL apply the header and footer configuration into Chromium print settings or injected CSS Paged Media `@page` rules
