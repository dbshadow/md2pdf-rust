# custom-prompt-modal Specification

## Purpose
提供一個基於 React 與 Promise 機制的自訂輸入對話框 Modal。當需要使用者輸入資訊（如儲存新範本的命名）時彈出，移除瀏覽器原生 window.prompt 在桌面端應用中產生的 origin 來源標頭（如 "localhost:5173 says:"），提升介面視覺質感與專業度。
## Requirements
### Requirement: Custom input prompt modal
The system SHALL display a customized HTML modal overlay instead of browser native dialogs for prompt inputs, removing any browser origin headers.

#### Scenario: Prompting user for template name
- **WHEN** the user triggers the "Save Template" action
- **THEN** the system SHALL render a custom modal overlay with backdrop blur and auto-focused input box

### Requirement: Modal interaction and submission
The system SHALL support modal submission (on clicking confirm or pressing Enter) and modal cancellation (on clicking cancel, overlay click, or pressing Escape).

#### Scenario: Submitting template name via input modal
- **WHEN** the user inputs a name and presses Enter or clicks confirm
- **THEN** the system SHALL close the modal, pass the input back to the template saving function, and resolve the action

