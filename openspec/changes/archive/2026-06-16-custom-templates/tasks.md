## 1. State and Storage Setup

- [x] 1.1 Import FilePlus and Trash2 from lucide-react in App.tsx
- [x] 1.2 Declare customTemplates state in App.tsx and initialize it by parsing "custom_templates" from localStorage
- [x] 1.3 Dynamically merge PRESET_TEMPLATES and customTemplates for the dropdown selection menu

## 2. Implement Template Actions

- [x] 2.1 Implement handleSaveAsCustomTemplate to prompt for a template name and save the current Markdown and CSS to localStorage
- [x] 2.2 Implement handleDeleteCustomTemplate to show a confirmation dialog, remove the template from localStorage, and fallback to the default template

## 3. UI Toolbar Integration

- [x] 3.1 Insert "Save as Template" button next to template select dropdown in App.tsx
- [x] 3.2 Render "Delete Template" button conditionally next to template select dropdown when active template ID starts with "custom_"
