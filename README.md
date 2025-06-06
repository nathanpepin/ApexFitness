# Workout Volume Tracker

A comprehensive workout tracking and planning application built with React, TypeScript, and modern web technologies. This app helps fitness enthusiasts and athletes plan workout routines, track muscle volume, analyze muscle stress/recovery patterns, and manage exercise databases.

## 🏋️‍♂️ Features

### Core Functionality
- **Workout Planning**: Create and manage multi-week training cycles (micro-cycles)
- **Exercise Database**: Comprehensive library of exercises with muscle group contributions
- **Volume Tracking**: Scientific approach to tracking training volume per muscle group
- **Intensity Management**: Support for RIR, RPE, and percentage-based training
- **Set Type Variations**: Regular sets, dropsets, myo-reps, and myo-rep matches

### Advanced Analytics
- **Muscle Stress Timeline**: Visualize how training stress accumulates and decays over time
- **Volume Radar Charts**: Compare your training volume against scientific recommendations
- **Recovery Modeling**: Advanced algorithms using Stimulus-Fatigue Ratios (SFR)
- **Volume Recommendations**: Based on MEV, MAV, and MRV principles

### Data Management
- **Local Storage**: All data stored locally using IndexedDB (no external servers)
- **Import/Export**: JSON-based backup and restore functionality
- **Routine Library**: Save and share workout routines
- **Exercise Customization**: Add custom exercises with muscle group assignments

### User Experience
- **Dark Mode**: Modern dark interface by default
- **Mobile Responsive**: Optimized for both desktop and mobile devices
- **Drag & Drop**: Intuitive exercise reordering within workouts
- **Real-time Calculations**: Live volume and stress calculations as you plan

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd workout-volume-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist/` directory.

## 🏗️ Technology Stack

### Frontend
- **React 18+** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development with strict configuration
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for styling

### UI Components
- **Radix UI** - Accessible, unstyled UI primitives
- **Lucide React** - Beautiful, customizable icons
- **Recharts** - Responsive charts built on D3.js

### Data & State
- **IndexedDB** - Client-side database for data persistence
- **React Hooks** - Modern state management with useState, useReducer, etc.
- **Local Storage** - Settings and preferences

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI primitives
│   └── ...             # Feature-specific components
├── constants/          # App constants and default data
├── types/              # TypeScript type definitions
├── utils/              # Utility functions and helpers
│   └── indexedDB.ts    # Database operations
├── App.tsx            # Main application component
└── main.tsx           # Application entry point
```

## 🔧 Key Concepts

### Volume Tracking
The app uses evidence-based volume recommendations:
- **MEV (Minimum Effective Volume)**: Minimum sets for growth
- **MAV (Maximum Adaptive Volume)**: Optimal growth range
- **MRV (Maximum Recoverable Volume)**: Upper limit before overreaching

### Muscle Groups
Tracks 15 primary muscle groups:
- Upper body: Chest, Front/Side/Rear Delts, Biceps, Triceps, Forearms, Traps, Upper/Lower Back
- Core: Core muscles
- Lower body: Glutes, Quads, Hamstrings, Calves

### Intensity Types
- **RIR (Reps in Reserve)**: How many reps could be performed before failure
- **RPE (Rate of Perceived Exertion)**: Subjective intensity scale (1-10)
- **Percentage**: Percentage of one-rep maximum (%1RM)

### Set Types
- **Regular**: Standard sets with rest between
- **Dropset**: Weight reduction within the set
- **Myo-rep**: Rest-pause technique
- **Myo-rep match**: Matching myo-rep volume

## 🎯 Usage Examples

### Creating a Workout
1. Navigate to the Tracker tab
2. Select a day to edit
3. Add exercises using the exercise selector
4. Configure sets, intensity, and type
5. View real-time volume calculations

### Analyzing Progress
1. Use the Muscle Stress Timeline to see recovery patterns
2. Check the radar chart for volume distribution
3. Review recommendations for each muscle group

### Managing Exercise Database
1. Go to the Exercises tab
2. Add custom exercises with muscle contributions
3. Edit existing exercises as needed
4. Export your database for backup

## ⚙️ Configuration

### Custom Instructions
The app supports GitHub Copilot custom instructions via `.github/copilot-instructions.md` for development assistance.

### Build Configuration
- Vite configuration in `vite.config.ts`
- TypeScript configuration in `tsconfig.json`
- Tailwind configuration in `tailwind.config.js`

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint
```

## 🤝 Contributing

### Development Guidelines
1. Follow the existing code style and patterns
2. Use TypeScript strictly - no `any` types
3. Write tests for new functionality
4. Ensure mobile responsiveness
5. Update documentation as needed

### Code Style
- Use Tailwind CSS for all styling
- Follow the established component patterns
- Maintain type safety throughout
- Use proper React hooks patterns

### Before Committing
- Run `npm run lint` to ensure code follows project standards
- Make sure all components follow React best practices
- Ensure tests pass with `npm run test`
- Update README if adding new features

## 📊 Data Privacy

- **Local-First**: All data stored locally on your device
- **No Servers**: No external servers or data transmission
- **Export Control**: You own and control your data
- **Privacy Focused**: No tracking or analytics

## 🐛 Known Issues & Limitations

- Large exercise databases may impact performance
- Complex calculations may slow on older devices
- Chart rendering can be resource-intensive with many data points

## 🗺️ Roadmap

### Planned Features
- Workout session tracking with timer
- Progressive overload tracking
- Exercise video integration
- Social features for sharing routines
- Advanced periodization models
- Nutrition tracking integration

### Technical Improvements
- Enhanced performance optimization
- Offline-first PWA capabilities
- Advanced data visualization
- Better mobile experience
- Accessibility improvements

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Exercise science research from Dr. Mike Israetel and Renaissance Periodization
- Volume recommendations based on scientific literature
- UI/UX inspiration from modern fitness apps
- Open source community for excellent tools and libraries

## 📞 Support

For bugs, feature requests, or questions:
1. Check existing issues in the repository
2. Create a new issue with detailed information
3. Include screenshots for UI-related issues
4. Provide steps to reproduce bugs

---

**Built with ❤️ for the fitness community**