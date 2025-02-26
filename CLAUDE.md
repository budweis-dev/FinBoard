# Trading Dashboard - Development Guidelines

## Project Commands
- No specific build/lint/test commands identified (purely client-side HTML/JS)
- To serve the application: `python -m http.server` or use any HTTP server
- Browser refresh needed to see changes

## Code Style Guidelines

### React Components
- Use functional components with React Hooks (useState, useEffect, useRef)
- Keep components focused on a single responsibility
- Follow PascalCase for component names (PriceTicker, OpeningHours, etc.)
- Destructure props in component parameters

### JavaScript Style
- Use const for variables that won't be reassigned
- Follow camelCase for variables, functions, and methods
- Consistently use arrow functions for component definitions
- Use template literals for string interpolation

### Formatting
- 2 or 4 space indentation (be consistent with existing code)
- Line breaks between logical sections of code
- Keep lines under 100 characters when possible

### CSS Style
- Follow kebab-case for CSS class names
- Group related CSS properties together
- Prefer Bootstrap classes where applicable

### Error Handling
- Properly handle async operations with try/catch blocks
- Provide user feedback during loading states
- Consider network errors in API calls