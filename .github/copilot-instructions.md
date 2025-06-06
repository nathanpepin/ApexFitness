# Workout Tracker App - GitHub Copilot Instructions

## Project Overview

This is a comprehensive workout tracking and planning application built with React, TypeScript, and Vite. The app helps fitness enthusiasts and athletes plan workout routines, track muscle volume, analyze muscle stress/recovery patterns, and manage exercise databases.

## Core Technologies & Framework

- **Frontend**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (prioritize utility classes)
- **UI Components**: Custom components built on Radix UI primitives
- **State Management**: React hooks (useState, useReducer, useMemo, useCallback)
- **Data Persistence**: IndexedDB for local storage
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React

## Code Style & Standards

### TypeScript Guidelines
- Use strict TypeScript configuration
- Always define proper interfaces/types for all data structures
- Prefer type unions over enums where appropriate
- Use proper generic typing for components and functions
- Follow the existing type definitions in `/src/types/index.ts`

### React Best Practices
- Use functional components with hooks exclusively
- Follow the single responsibility principle for components
- Use proper dependency arrays in useEffect and useMemo
- Prefer composition over inheritance
- Use React.memo for performance optimization when appropriate
- Always use descriptive component and prop names

### Styling Guidelines
- **CRITICAL**: Always prioritize Tailwind CSS utility classes over custom CSS
- Use semantic class names when Tailwind utilities aren't sufficient
- Follow mobile-first responsive design principles
- Use dark mode by default with proper theme support
- Maintain consistent spacing using Tailwind's scale (4, 8, 12, 16, etc.)
- Use gradient backgrounds and modern UI patterns

### File Organization
- Components in `/src/components/` with subfolders for organization
- UI primitives in `/src/components/ui/`
- Type definitions in `/src/types/index.ts`
- Constants and data in `/src/constants/index.ts`
- Utilities in `/src/utils/`
- Use index.ts files for clean imports

## Domain-Specific Knowledge

### Fitness & Exercise Science
- **Volume**: Number of sets performed for a muscle group per week
- **Intensity Types**: RIR (Reps in Reserve), RPE (Rate of Perceived Exertion), Percentage (of 1RM)
- **Set Types**: Regular, Dropset, Myo-rep, Myo-rep match
- **SFR**: Stimulus-Fatigue Ratio (affects recovery calculations)
- **Muscle Groups**: 15 primary muscle groups tracked (see MUSCLE_GROUPS constant)

### Key Business Logic
- Volume calculations based on exercise muscle contributions
- Stress/recovery modeling with decay algorithms
- Supersets affect recovery and stimulus patterns
- Volume recommendations based on scientific literature (MEV, MAV, MRV)

## Muscle Order Convention

When displaying muscles in lists or interfaces, always use this order:
- Chest
- Front Delts
- Side Delts
- Rear Delts
- Biceps
- Triceps
- Forearms
- Traps
- Upper Back
- Lower Back
- Core
- Glutes
- Quads
- Hamstrings
- Calves

## Data Management

### IndexedDB Usage
- **Never use localStorage or sessionStorage** - this app uses IndexedDB exclusively
- Store exercises, routines, and cycles in separate object stores
- Always handle async operations properly with error handling
- Use the existing utility functions in `/src/utils/indexedDB.ts`

### Data Structures
- `Exercise`: Base exercise definition with muscle contributions
- `WorkoutExercise`: Exercise instance in a workout with sets/intensity
- `WorkoutDay`: Collection of exercises for a day
- `WorkoutWeek`: Collection of days (micro-cycle)
- `SavedRoutine`: Named collection of weeks

## Component Patterns

### Form Handling
- Use controlled components for form inputs
- Implement proper validation with clear error states
- Use Tailwind for form styling (focus states, validation styling)
- Handle both add/edit modes in the same component when appropriate

### Modal/Dialog Components
- Use Radix UI Dialog primitives
- Always include proper ARIA attributes
- Implement responsive designs (mobile-friendly)
- Use backdrop dismissal and escape key handling

### Data Visualization
- Use Recharts for all charts and graphs
- Implement responsive chart sizing
- Use consistent color schemes (see muscleColors constant)
- Include proper tooltips and legends

## Performance Considerations

- Use React.memo for components that receive stable props
- Memoize expensive calculations with useMemo
- Use useCallback for event handlers passed to child components
- Implement virtual scrolling for large exercise lists
- Optimize bundle size by importing only needed utilities

## Testing Guidelines

- Write unit tests for utility functions
- Test custom hooks in isolation
- Mock IndexedDB operations in tests
- Test edge cases in volume calculations
- Ensure accessibility compliance

## Security & Best Practices

- Validate all user inputs
- Sanitize data before storage
- Handle errors gracefully with user-friendly messages
- Implement proper loading states
- Use TypeScript's strict mode for type safety

## Agent Mode Specific Instructions

When working in agent mode:
1. Always understand the full context before making changes
2. Test changes thoroughly, especially data persistence
3. Maintain existing functionality while adding new features
4. Follow the established patterns and conventions
5. Consider the impact on existing user data
6. Update related types and constants when adding features
7. Ensure mobile responsiveness for all new components
8. Add proper error handling and loading states

## Common Tasks & Patterns

### Adding New Exercises
- Update `DEFAULT_EXERCISES` constant
- Ensure proper muscle group assignments
- Include appropriate stimulus-fatigue ratios
- Test volume calculations

### Creating New Components
- Use TypeScript interfaces for props
- Implement responsive design with Tailwind
- Follow existing naming conventions
- Add proper error boundaries where needed

### Modifying Data Structures
- Update TypeScript interfaces first
- Ensure backward compatibility with stored data
- Update all dependent components
- Test data migration if needed

This instruction set ensures consistency, maintainability, and alignment with the app's architecture and domain requirements.