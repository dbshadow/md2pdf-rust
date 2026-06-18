## Why

Currently, the application UI is hardcoded in Traditional Chinese. To appeal to a global user base, the application needs to support localization (i18n) for six target languages: Traditional Chinese (default), English, Simplified Chinese, German, Spanish, and French.

## What Changes

- **i18n Dictionary**: Build a zero-dependency translation dictionary mapped to language keys.
- **Language State & Persistence**: Track language selection using a React state, persisted in `localStorage`.
- **Language Switcher UI**: Add a dropdown popover language switcher button showing country flags in the header toolbar.
- **UI Localization**: Replace all UI strings in `src/App.tsx` with localized dictionary lookups.

## Capabilities

### New Capabilities
- `i18n-support`: Multi-language interface localization supporting Traditional Chinese, English, Simplified Chinese, German, Spanish, and French, with persistent user selection.

### Modified Capabilities
<!-- None -->

## Impact

- **Frontend (`src/App.tsx`)**: Imports translation keys, declares language selection states, implements localization lookups, and adds the switcher menu markup.
- **Translation Keys (`src/i18n.ts`)**: Introduces a new translation source file containing language dictionary mappings.
- **Styling (`src/index.css`)**: Adds language selection menu positioning, hover, and popover animations.
