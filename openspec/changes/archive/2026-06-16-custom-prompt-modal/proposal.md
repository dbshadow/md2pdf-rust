## Why

Currently, when users save a custom template, they are prompted for a template name using the native browser `window.prompt`. In a desktop application environment (Tauri), the native prompt displays the web origin title (e.g., "localhost:5173 says:"), which looks unpolished and out of place. Replacing this with a custom React modal provides a professional desktop user experience.

## What Changes

- **Custom Prompt Modal UI**: Build a stylized React dialog overlay component with modern animations, glassmorphism backdrop blur, and custom input styling.
- **Promise-Based Prompt State**: Manage modal visibility and resolve user inputs using React states and a Promise-based ref mechanism to maintain simple asynchronous control flow.
- **Save Flow Refactoring**: Replace the native `window.prompt` call in `handleSaveAsCustomTemplate` with the custom Promise-based `showPrompt` call.

## Capabilities

### New Capabilities
- `custom-prompt-modal`: A Promise-based modal component providing custom prompt dialog inputs, styled to match the application theme without browser origin headers.

### Modified Capabilities
<!-- None -->

## Impact

- **Frontend (`src/App.tsx`)**: Declares prompt modal visibility and input states, implements `showPrompt` Promise resolver ref, and integrates prompt HTML into JSX layout.
- **Styling (`src/index.css`)**: Adds modal overlay backdrop filter, slide-up animations, content wrappers, inputs, and button layout styles.
