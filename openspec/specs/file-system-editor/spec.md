# file-system-editor Specification

## Purpose
TBD - created by archiving change file-io-support. Update Purpose after archive.
## Requirements
### Requirement: Open Markdown File
The system SHALL allow users to select and open a local Markdown file (with `.md` or `.markdown` extensions) via a native file dialog, read its text content, and load it into the editor.

#### Scenario: Open file successfully
- **WHEN** the user triggers the "Open File" action and selects a valid local Markdown file in the dialog
- **THEN** the system SHALL read the file, load its content into the editor, record the absolute path, and set the editor state as unsaved-changes-free

### Requirement: Save Markdown File
The system SHALL save the current editor contents directly back to the active file path if one is already tracked.

#### Scenario: Save existing file
- **WHEN** the editor tracks an active file path and the user triggers the "Save File" action
- **THEN** the system SHALL write the editor contents back to the tracked file path, and reset the status to unsaved-changes-free

### Requirement: Save Markdown File As
The system SHALL allow users to save the current editor contents to a newly selected local file path using a native save file dialog.

#### Scenario: Save as new file path
- **WHEN** the user triggers the "Save File As" action, inputs a filename, and confirms
- **THEN** the system SHALL write the editor contents to the chosen path, update the active tracked file path, and reset the status to unsaved-changes-free

