# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Code Smells Reference Dashboard** - an interactive, single-page web application for learning about code smells based on Martin Fowler's refactoring catalog. The application provides:
- Comprehensive catalog of 20+ general code smells across multiple categories
- AWS Lambda-specific code smell patterns (10+ serverless anti-patterns)
- Python code examples showing "before" and "after" refactoring
- Step-by-step fix instructions and refactoring techniques

## Tech Stack

- **Pure Frontend**: HTML, CSS (custom), Vanilla JavaScript (no frameworks)
- **Syntax Highlighting**: Prism.js
- **Deployment**: Static site (can be served with any web server)

## How to Run

Since this is a static web application, simply open `index.html` in a browser:

```bash
# Using Python's built-in server
python3 -m http.server 8000
# Then visit http://localhost:8000

# Or using Node's http-server
npx http-server -p 8000
```

No build step or package installation is required.

## Architecture

### Core Files

1. **index.html** - Main HTML structure
   - Mobile-responsive layout with hamburger menu
   - Sidebar navigation with search and tabs
   - Main content area with code examples
   - Uses Prism.js CDN for syntax highlighting

2. **app.js** - All application logic
   - Contains the complete `codeSmells` data structure with:
     - `general`: Object with 5 categories (bloaters, objectOrientationAbusers, changePreventers, dispensables, couplers)
     - `lambda`: Array of AWS Lambda-specific code smells
   - State management (currentTab, currentSmell, learnedSmells, searchTerm)
   - UI rendering functions (renderSidebar, displaySmell)
   - Event handlers (search, tabs, random button, learned checkbox)

3. **style.css** - Complete styling
   - CSS custom properties for theming
   - Responsive design with mobile breakpoints
   - Category-specific background colors
   - Code panel styling (bad vs. good code comparison)

### Data Structure

JSON files contain structured code smell data:
- `code_smells_catalog.json` - General code smells catalog
- `aws_lambda_code_smells.json` - Lambda-specific smells
- `python_code_smell_examples.json` - Python code examples
- `lambda_code_smell_examples.json` - Lambda code examples

**Important**: The main data source is embedded in `app.js` as the `codeSmells` object. The JSON files may be used for reference or external consumption.

### Code Smell Object Schema

Each code smell has:
```javascript
{
  name: string,              // Display name
  category: string,          // Category badge
  brief: string,             // One-line description
  indicators: string[],      // Warning signs to look for
  why: string,               // (Lambda only) Why it matters
  pythonBad: string,         // Problem code example
  pythonGood: string,        // Refactored code example
  fixSteps: string[],        // Step-by-step fix instructions
  techniques: string[]       // (General only) Refactoring techniques
}
```

## Key Features

1. **Dual Mode**:
   - General tab: Classic code smells (Fowler's catalog)
   - Lambda tab: AWS serverless-specific anti-patterns

2. **Interactive Learning**:
   - Click any smell to see detailed explanation
   - Mark smells as "learned" (tracked in state)
   - Random smell generator
   - Search functionality

3. **Code Examples**:
   - Side-by-side comparison (bad vs. good)
   - Syntax highlighted with Prism.js
   - Copy-to-clipboard buttons

## Development Guidelines

### Adding a New Code Smell

1. Add to the appropriate category in the `codeSmells` object in `app.js`:

```javascript
// For general smells
codeSmells.general.bloaters.push({
  name: 'Your Smell Name',
  brief: 'One-line description',
  indicators: ['indicator 1', 'indicator 2'],
  pythonBad: `# BAD: ...`,
  pythonGood: `# GOOD: ...`,
  fixSteps: ['step 1', 'step 2'],
  techniques: ['Technique Name']
});

// For Lambda smells
codeSmells.lambda.push({
  name: 'Lambda Smell Name',
  category: 'Category Name',
  brief: 'Description',
  indicators: ['indicator 1'],
  why: 'Why this matters in Lambda context',
  pythonBad: `# BAD: ...`,
  pythonGood: `# GOOD: ...`,
  fixSteps: ['step 1', 'step 2']
});
```

2. No additional rendering code needed - the display logic is generic

### Modifying Styles

- CSS custom properties are defined in `:root` for easy theming
- Category colors: `--color-bg-1` through `--color-bg-8`
- Responsive breakpoints are handled via media queries
- Mobile-first approach with sidebar that slides in on small screens

### State Management

State is simple global variables in `app.js`:
- `currentTab`: 'general' or 'lambda'
- `currentSmell`: Currently displayed smell object
- `learnedSmells`: Array of learned smell names (not persisted)
- `searchTerm`: Current search query

**Note**: Learned state is not persisted. Add localStorage integration if persistence is needed.

## Code Organization Principles

- **No Build Process**: Keep it simple - no bundlers, transpilers, or package managers
- **Single Responsibility**: Each function in app.js does one thing
- **Data-Driven**: All content is in the codeSmells object, rendering is generic
- **Progressive Enhancement**: Works without JavaScript for basic content viewing

## Common Tasks

### Testing Changes
1. Edit the file(s)
2. Refresh browser (hard refresh: Cmd+Shift+R or Ctrl+Shift+F5)
3. No compilation or build step needed

### Adding Categories
If adding a new category to general smells, update:
1. `codeSmells.general` object in app.js
2. `categoryNames` object in `createCategory()` function

### Debugging
- Use browser DevTools Console
- Check `codeSmells` object in console: `console.log(codeSmells)`
- Verify Prism.js loaded: Check Network tab for CDN requests
