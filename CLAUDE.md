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
- **`shippypro_real_examples.json`** - Real-world examples from ShippyPro codebase

**Important**: The main data source is embedded in `app.js` as the `codeSmells` object. ShippyPro real examples are stored in `shippypro_real_examples.json` and loaded dynamically at runtime. The JSON files may be used for reference or external consumption.

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

### Managing ShippyPro Real Examples

Real-world examples from the ShippyPro codebase are stored in `shippypro_real_examples.json` and loaded dynamically at runtime. This separation makes it easy to add, update, or remove examples without modifying `app.js`.

**File Structure:**
```json
{
  "Code Smell Name": [
    {
      "language": "PHP" | "TypeScript",
      "file": "path/to/file.php",
      "line": 123,
      "method": "methodName()",
      "description": "Brief description of the smell",
      "metrics": { "key": "value" }
    }
  ]
}
```

**Adding a Real Example:**

1. Open `shippypro_real_examples.json`
2. Find the code smell name (must match exactly the `name` in `app.js`)
3. Add a new object to the array:

```json
{
  "Long Method": [
    {
      "language": "PHP",
      "file": "services/your-service/app/YourClass.php",
      "line": 100,
      "method": "yourMethod()",
      "description": "What makes this a long method",
      "metrics": { "lines": 200, "complexity": "Very High" }
    }
  ]
}
```

4. No changes to `app.js` needed - examples load automatically!

**Removing a Real Example:**

1. Open `shippypro_real_examples.json`
2. Find the code smell and remove the object from its array
3. If removing the last example, you can either:
   - Leave an empty array: `"Code Smell Name": []`
   - Or remove the key entirely

**Verifying Examples:**

The real examples reference actual ShippyPro code at:
- **PHP services**: `/Users/amir/Development/work/services-monorepo/services/`
- **TypeScript/React**: `/Users/amir/Development/work/app.shippypro.com/apps/web/src/`

To verify an example still exists:
```bash
# PHP example
cat /Users/amir/Development/work/services-monorepo/services/order-service/app/Services/OrderService.php | head -n 200

# TypeScript example
cat /Users/amir/Development/work/app.shippypro.com/apps/web/src/features/order/hooks/useGetMenuConfig.tsx
```

**Loading Behavior:**

- Examples are loaded asynchronously when the app starts
- If the JSON file is missing, the app continues without errors (warning in console)
- If a code smell has no `realExamples`, the "Real Examples from ShippyPro Codebase" section is hidden
- Console shows `✅ Loaded ShippyPro real examples` on success

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
