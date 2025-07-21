# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Dork Watcher is a Google Dorking security tool that helps check websites for potential information leaks. It's a client-side web application that generates Google search queries using predefined "dorks" (specialized search patterns) to identify exposed files, admin panels, and sensitive information.

## Architecture

- **Static Web Application**: Pure HTML/CSS/JavaScript with no build process or server dependencies
- **dorks.js**: Contains an array of Google Dork definitions with categories (ファイル漏洩/管理系/情報ワード/その他) and risk levels (high/medium/low)
- **script.js**: Main application logic that filters dorks and generates Google search URLs
- **index.html**: Single-page interface with domain input, category/risk filters, and results display
- **style.css**: Styling for the web interface

## Core Components

### Dork Structure
Each dork object contains:
- `query`: The Google search pattern (e.g., "filetype:xls", "inurl:admin")
- `explanation`: Japanese description of what the dork searches for
- `risk`: Risk level classification (high/medium/low)
- `category`: Type classification (ファイル漏洩/管理系/情報ワード/その他)

### Main Functionality
The `generateDorks()` function in script.js:
1. Takes user domain input
2. Applies category and risk filters
3. Constructs `site:domain.com` + dork queries
4. Generates clickable Google search links

## Development Notes

- No package manager, build tools, or dependencies
- Can be served directly as static files
- Opens in browser for local development
- Designed for GitHub Pages deployment
- All text is in Japanese as this is a Japanese security tool

## Testing

Open index.html in a web browser and test with various domain inputs and filter combinations.