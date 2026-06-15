## ADDED Requirements

### Requirement: Mermaid Client-Side Rendering
The system SHALL compile Markdown code blocks labeled with the `mermaid` language tag and render them as interactive SVG diagrams within the frontend preview panel.

#### Scenario: User writes a valid Mermaid flowchart
- **WHEN** the markdown text contains a ````mermaid` code block and the HTML preview is rendered
- **THEN** the system SHALL load the Mermaid.js library and render the code block into an SVG node representing the flowchart inside the preview iframe
