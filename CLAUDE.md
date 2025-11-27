# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Dork Watcher is a Google Dorking security tool that helps check websites for potential information leaks. It's a client-side web application that generates Google search queries using predefined "dorks" (specialized search patterns) to identify exposed files, admin panels, and sensitive information.

## Architecture

- **Static Web Application**: Pure HTML/CSS/JavaScript with no build process or server dependencies
- **dorks.js**: Contains the `dorks` array with Google Dork definitions
- **script.js**: Main application logic including filtering, URL generation, theming, and i18n
- **index.html**: Single-page interface with domain input, filters, help modal, and results display
- **style.css**: Styling with CSS custom properties for dark/light theme support

## Core Components

### Dork Structure (dorks.js)
Each dork object in the `dorks` array contains:
- `query`: The Google search pattern (e.g., "filetype:xls", "inurl:admin")
- `explanation`: Japanese description of what the dork searches for
- `explanationEn`: English description (for i18n support)
- `risk`: Risk level classification (high/medium/low)
- `category`: Type classification (ファイル漏洩/管理系/情報ワード/その他)

### Main Functions (script.js)
- `generateDorks()`: Core function that filters dorks by category/risk and generates Google search URLs with `site:domain.com` prefix
- `toggleTheme()` / `initTheme()`: Dark/light mode with localStorage persistence and system preference detection
- `toggleLanguage()` / `initLanguage()`: Japanese/English i18n with localStorage persistence
- `showHelpModal()` / `hideHelpModal()`: Help modal display

### Keyboard Shortcuts
- `Enter`: Trigger dork generation
- `Escape`: Close help modal

## Development

- No build process required - serve static files directly
- Open index.html in browser or use any local server
- Deployed to GitHub Pages at https://ipusiron.github.io/dork-watcher/
- Supports bilingual interface (Japanese primary, English secondary)