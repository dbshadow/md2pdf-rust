## ADDED Requirements

### Requirement: Maximized window startup
The application's main window SHALL launch in a maximized state by default when the application starts.

#### Scenario: Verify startup state is maximized
- **WHEN** the application starts up
- **THEN** the primary window SHALL display in a maximized state across the screen

### Requirement: Fallback default window dimensions
The fallback dimensions for the window SHALL be updated to a larger resolution of 1280x800, providing an optimal workspace when restored from a maximized state.

#### Scenario: Verify dimensions after restore
- **WHEN** the user restores the window from its maximized state
- **THEN** the window size SHALL fall back to a width of 1280 pixels and a height of 800 pixels
