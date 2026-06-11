## ADDED Requirements

### Requirement: Local Image Resolution and Embedding
The system SHALL automatically resolve local image paths referenced in Markdown (specifically relative paths), read their binary data locally from the host filesystem, and embed them as Base64 Data URLs inside the compiled HTML.

#### Scenario: Local relative image in Markdown
- **WHEN** the markdown text contains `![alt](./test.png)` and a valid image file named `test.png` exists in the application's executable directory
- **THEN** the system SHALL encode the image binary to a base64 string, replace the image source with a `data:image/png;base64,...` URL, and display the image correctly in both the preview and generated PDF
