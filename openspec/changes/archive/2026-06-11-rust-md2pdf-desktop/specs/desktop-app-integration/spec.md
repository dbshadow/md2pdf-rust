## ADDED Requirements

### Requirement: Standalone Window Execution
The system SHALL execute as a standalone desktop window application on the host operating system, encapsulating both the React-based frontend editor and the Rust-based backend.

#### Scenario: App startup
- **WHEN** the user launches the application executable
- **THEN** a standalone desktop window SHALL display, containing the full Markdown/CSS editors, instant HTML preview, and PDF rendering workspace

### Requirement: Portable Executable Build
The system SHALL support building into a single, portable executable file (`.exe` on Windows) that can run without installing external runtime dependencies (such as Node.js, Python, or a standalone Chrome/Puppeteer package).

#### Scenario: Release compilation
- **WHEN** the application is compiled for production release
- **THEN** it SHALL output a single executable file that can run independently on the target system
