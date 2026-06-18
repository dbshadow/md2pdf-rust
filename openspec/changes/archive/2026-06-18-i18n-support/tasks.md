## 1. i18n Dictionary Setup

- [x] 1.1 Create src/i18n.ts file containing the translation mappings for all six languages and export TRANSLATIONS and LANGUAGES

## 2. React Hook and Translation Function Setup

- [x] 2.1 Import TRANSLATIONS and LANGUAGES in App.tsx
- [x] 2.2 Declare lang and isLangMenuOpen states in App.tsx, initializing lang from localStorage
- [x] 2.3 Implement the helper t(key) function in App.tsx
- [x] 2.4 Add click-outside event listener to auto-close the language dropdown menu on unmount/clicks

## 3. UI Switcher and Styles Integration

- [x] 3.1 Render the flag switcher button and popover dropdown menu in App.tsx header controls
- [x] 3.2 Add styles for the switcher menu (absolute positioning, animations, list hovers) to src/index.css
- [x] 3.3 Replace all hardcoded UI strings in App.tsx with localized t('key') lookups

