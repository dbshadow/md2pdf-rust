## ADDED Requirements

### Requirement: LaTeX Math Rendering
The system SHALL parse and render LaTeX mathematical formulas in both inline (`$...$`, `\(...\)`) and block (`$$...$$`, `\[...\]`) formats using KaTeX.

#### Scenario: User writes inline math formula
- **WHEN** user enters Markdown text containing `$E = mc^2$`
- **THEN** the system SHALL render the mathematical formula inline as formatted KaTeX math symbols

#### Scenario: User writes block math formula
- **WHEN** user enters Markdown text containing a block formula `$$\int_{a}^{b} f(x)dx$$`
- **THEN** the system SHALL render the formula as a centered, formatted block equation in both HTML preview and PDF output
