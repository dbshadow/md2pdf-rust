## Why

Currently, the application only provides 5 predefined templates. When users spend time modifying CSS stylesheets or writing custom page layouts, there is no way to save these modifications as reusable templates. Providing a mechanism to save and manage custom templates prevents loss of user customizations and enhances reuse.

## What Changes

- **Custom Template Storage**: Store custom templates locally in the browser's `localStorage`.
- **Save Custom Template Button**: Add a "Save as Template" button in the header toolbar to trigger a naming dialog.
- **Delete Custom Template Button**: Add a conditional "Delete Template" button shown only when a custom template is active, allowing users to remove it.
- **Integrated Template Selection**: Merge custom templates dynamically with the preset templates in the dropdown select menu.

## Capabilities

### New Capabilities
- `custom-templates`: Enable saving, loading, and deleting of custom document templates (Markdown content + CSS stylesheet) persisted in local storage.

### Modified Capabilities
<!-- None -->

## Impact

- **Frontend (`src/App.tsx`)**: Manages `customTemplates` React state, updates initialization to merge presets and custom templates, handles dialog prompts, and implements save/delete actions.
