# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Dork Watcher is a Google Dorking security tool that helps check websites for potential information leaks. It's a client-side web application that generates Google search queries using predefined "dorks" (specialized search patterns) to identify exposed files, admin panels, and sensitive information.

## Architecture

- **Static Web Application**: Pure HTML/CSS/JavaScript with no build process or server dependencies
- **domain.js**: Pure `normalizeDomain(input)` for URL hostname extraction, IDN and DNS-label validation
- **query.js**: Pure query builders, operator-style transformation and three-axis filtering
- **dorks.js**: Contains exactly 30 baseline `filetype:` Dorks with stable ids and official flags
- **test/**: Dependency-free Node tests, including README tables and the complete directory tree
- **.github/workflows/test.yml**: Node 22, `npm test` on push and pull_request
- **i18n.js**: The Japanese/English dictionaries plus the DOM layer that applies them
- **script.js**: Main application logic including filtering, URL generation and theming
- **index.html**: Single-page interface with domain input, filters, help modal, and results display
- **style.css**: Styling with CSS custom properties for dark/light theme support

## Core Components

### Dork Structure (dorks.js)
Each dork object in the `dorks` array contains:

- `id`: Unique lowercase/hyphen identifier; preserve the existing order
- `official`: Whether the baseline query uses only the six operators listed in Google Search Help
- `query`: The Google search pattern (e.g., "filetype:xls", "inurl:admin")
- `explanation`: Japanese description of what the dork searches for
- `explanationEn`: English description (for i18n support)
- `risk`: Risk level classification (high/medium/low)
- `category`: Type classification (ファイル漏洩/管理系/情報ワード/その他)

### Main Functions (script.js)

- `generateDorks()`: Core function that validates the domain, filters by category/risk/operator and generates Google search URLs with `site:domain.com` prefix
- `toggleTheme()` / `initTheme()`: Dark/light mode with localStorage persistence and system preference detection
- `onLanguageChange()`: Re-renders state-derived labels, the help body and the live notice
- `showHelpModal()` / `hideHelpModal()`: Help modal display

### Language (i18n.js)

- `I18n.init()`: Resolves the language from `?lang=`, then localStorage, then `navigator.language`
- `I18n.setLanguage(value)`: Persists the choice, re-applies the dictionary and fires `languagechange`
- `I18n.t(key, values)`: Looks up a message and fills `{name}` holes; throws on an unknown key
- `I18n.apply(root)`: Writes `data-i18n`, `data-i18n-title`, `data-i18n-aria-label` and `data-i18n-placeholder`
- Search operators (site:, filetype:, inurl:, intitle:, intext:, ext:) are proper names; translate their explanations, never the operators
- Do not put `data-i18n-<attr>` on the theme toggle: its label comes from state, so `apply()` would roll it back

### Keyboard Shortcuts

- `Enter`: Generate only while the domain input is focused and the help modal is closed
- `Escape`: Close help modal

## Development

- No build process required - serve static files directly
- Keep classic scripts with conditional CommonJS exports; do not convert to ES modules
- Direct `file://` and local HTTP are verified in Chromium
- Use `python -m http.server 8000 --bind 127.0.0.1` for local HTTP
- Use `npm test` with Node 22 or newer; do not add dependencies
- Deployed to GitHub Pages at https://ipusiron.github.io/dork-watcher/
- Supports bilingual interface (Japanese primary, English secondary)

## Invariants and Safety

- Exactly 30 Dorks: categories 10 / 9 / 7 / 4, risks high 18 / medium 10 / low 2
- Baseline queries must not contain site:, ext: or allin operators; OR expressions must be parenthesized
- Baseline official/undocumented counts: 15 / 15; ext style: 5 / 25; only 12 queries change
- Remove quoted strings before extracting operators; exclusion prefixes such as -inurl: still count
- Never put filetype: inside quoted strings in a definition; style conversion is intentionally simple
- Each row builds one styled full query; use it for link text, URL, copy, dynamic label and filtering
- filterDorks accepts a list; the UI passes prepared full queries with the no-conversion default style
- Normalize trimmed input with URL.hostname; reject internal whitespace, control characters, IPs and malformed labels
- Maximum hostname length 253; labels 1–63; at least two labels; alphabetic or xn-- TLD
- URL paths, ports and credentials are discarded; IDN becomes punycode; render notes with textContent
- No innerHTML assignment, inline event/style attributes, external resources or automatic searches
- Clipboard API only; announce failures instead of using execCommand
- Read/write settings only through try/catch guarded readSetting/writeSetting
- Store only theme and operatorStyle in script.js; i18n.js owns dork-watcher-language
- Invalid stored values fall back to validated defaults; blocked storage must not break the page
- Keep Japanese/English help bodies in HTML and route every dynamic string through `I18n.t`
- Hold the live notice as `{ key, values }` so a language change can re-translate it
- Enter is scoped to the input; Escape and focus trapping are scoped to the open help dialog
- Preserve existing images; screenshots are captured with the external Day020 Python script
- Existing query descriptions and metadata identifiers remain unchanged
