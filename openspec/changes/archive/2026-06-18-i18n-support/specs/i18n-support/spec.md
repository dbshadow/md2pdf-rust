## ADDED Requirements

### Requirement: Persistent language settings
The system SHALL persist the user's language preference locally and support six languages: Traditional Chinese (zh-TW, default), English (en), Simplified Chinese (zh-CN), German (de), Spanish (es), and French (fr).

#### Scenario: Startup with default locale
- **WHEN** the application starts up and no locale is saved in localStorage
- **THEN** the system SHALL display all UI elements in Traditional Chinese

### Requirement: Language switcher popover menu
The system SHALL provide a language selector button in the header toolbar showing a flag. Clicking it SHALL toggle a dropdown popover menu listing all six languages with their corresponding flag emojis.

#### Scenario: User switches active language to English
- **WHEN** the user opens the language switcher and clicks "English (🇺🇸)"
- **THEN** the system SHALL immediately translate all UI labels, button tooltips, badges, placeholders, and popup messages to English, and save "en" to localStorage
