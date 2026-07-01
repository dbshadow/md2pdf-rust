## ADDED Requirements

### Requirement: macOS Universal DMG Bundle
系統 SHALL 支援為 macOS 平台構建雙架構通用安裝檔 (`_universal.dmg`)，使得安裝程式能同時在 Intel 晶片及 Apple M 晶片的 Mac 電腦上流暢運行。

#### Scenario: Build universal macOS dmg
- **WHEN** 觸發 GitHub Actions 的 macOS 打包任務時
- **THEN** 系統將生成名為 `md2pdf_{version}_universal.dmg` 的通用安裝檔，並自動上傳至 GitHub Release 的 Assets 中。
