## ADDED Requirements

### Requirement: KaTeX Async Render Waiting in PDF Generation
The system SHALL ensure KaTeX rendering is complete before the headless browser captures and exports the PDF.

#### Scenario: Compiling Markdown with math formulas to PDF
- **WHEN** user requests PDF compilation for Markdown containing LaTeX formulas
- **THEN** Rust headless browser SHALL wait for both Mermaid diagrams and KaTeX formulas to finish rendering before capturing the PDF buffer
