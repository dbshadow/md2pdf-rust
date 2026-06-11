## ADDED Requirements

### Requirement: Local PDF Compilation
The system SHALL compile Markdown and CSS into a PDF binary on the local server.

#### Scenario: Server receives compile request
- **WHEN** the backend receives a POST request containing Markdown text and CSS rules
- **THEN** it SHALL parse Markdown to HTML, inject the CSS, and use Puppeteer to render a PDF buffer

### Requirement: PDF Page and Margin Control
The system SHALL support CSS page size (`@page`), margins, and print-specific layout rules.

#### Scenario: CSS contains page margin definitions
- **WHEN** the user includes `@page { size: A4; margin: 20mm; }` in their CSS
- **THEN** the generated PDF SHALL respect these constraints in the output document

### Requirement: Page Breaks and Header/Footer Support
The system SHALL support explicit page breaks and custom headers/footers in the generated PDF.

#### Scenario: Explicit page break
- **WHEN** the Markdown contains HTML tags like `<div style="page-break-after: always;"></div>` or markdown HR elements mapped to page-breaks
- **THEN** the generated PDF SHALL start a new page after that element
