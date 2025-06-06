import { WorkoutVolumeData, VolumeRange, FrequencyRange } from '../types';
import type { Exercise, MuscleGroup, ExerciseCategory, WorkoutWeek, WorkoutDay, WorkoutExercise } from '@/types';

export const DEFAULT_EXERCISES: Exercise[] = [
  // =============================================================================
  // CHEST EXERCISES
  // =============================================================================
  { name: 'Barbell Bench Press', category: 'Push', muscles: { Chest: 1, Triceps: 0.5, 'Front Delts': 0.5 }, stimulusFatigue: 1.0 },
  { name: 'Dumbbell Bench Press', category: 'Push', muscles: { Chest: 1, Triceps: 0.5, 'Front Delts': 0.5 }, stimulusFatigue: 1.0 },
  { name: 'Incline Barbell Press', category: 'Push', muscles: { Chest: 1, 'Front Delts': 0.6, Triceps: 0.5 }, stimulusFatigue: 1.1 },
  { name: 'Incline Dumbbell Press', category: 'Push', muscles: { Chest: 1, 'Front Delts': 0.5, Triceps: 0.5 }, stimulusFatigue: 1.2 },
  { name: 'Decline Bench Press', category: 'Push', muscles: { Chest: 1, Triceps: 0.5, 'Front Delts': 0.3 }, stimulusFatigue: 1.0 },
  { name: 'Decline Dumbbell Press', category: 'Push', muscles: { Chest: 1, Triceps: 0.5, 'Front Delts': 0.3 }, stimulusFatigue: 1.0 },
  { name: 'Cambered Bar Bench Press', category: 'Push', muscles: { Chest: 1, Triceps: 0.5, 'Front Delts': 0.4 }, stimulusFatigue: 1.0 },
  { name: 'Cambered Bar Incline Bench Press', category: 'Push', muscles: { Chest: 1, 'Front Delts': 0.5, Triceps: 0.5 }, stimulusFatigue: 1.1 },
  { name: 'Machine Chest Press', category: 'Push', muscles: { Chest: 1, Triceps: 0.4, 'Front Delts': 0.4 }, stimulusFatigue: 0.8 },
  { name: 'Cable Fly', category: 'Push', muscles: { Chest: 1, 'Front Delts': 0.2 }, stimulusFatigue: 0.7 },
  { name: 'Dumbbell Fly', category: 'Push', muscles: { Chest: 1, 'Front Delts': 0.2 }, stimulusFatigue: 0.7 },
  { name: 'Pec Deck', category: 'Push', muscles: { Chest: 1, 'Front Delts': 0.2 }, stimulusFatigue: 0.6 },
  { name: 'Pushup', category: 'Push', muscles: { Chest: 1, Triceps: 0.6, 'Front Delts': 0.4, Core: 0.3 }, stimulusFatigue: 0.8 },
  { name: 'Dips (Bodyweight)', category: 'Push', muscles: { Chest: 0.7, Triceps: 1, 'Front Delts': 0.3, Core: 0.2 }, stimulusFatigue: 1.1 },
  { name: 'Fly Curl (Dumbbells)', category: 'Arms', muscles: { Chest: 0.7, Biceps: 0.3 }, stimulusFatigue: 0.7 },
  { name: 'Fly Curl (Cable)', category: 'Arms', muscles: { Chest: 0.7, Biceps: 0.3 }, stimulusFatigue: 0.7 },

  // =============================================================================
  // SHOULDER EXERCISES (Front, Side, Rear Delts)
  // =============================================================================
  { name: 'Overhead Press', category: 'Push', muscles: { 'Front Delts': 1, 'Side Delts': 0.5, Triceps: 0.5, Core: 0.2, Traps: 0.1 }, stimulusFatigue: 1.5 },
  { name: 'Push Press (Barbell)', category: 'Push', muscles: { 'Front Delts': 1, 'Side Delts': 0.3, Triceps: 0.3, Quads: 0.2, Core: 0.3 }, stimulusFatigue: 1.4 },
  { name: 'Arnold Press (Dumbbells)', category: 'Push', muscles: { 'Front Delts': 1, 'Side Delts': 0.7, Triceps: 0.3, Traps: 0.2, Core: 0.1 }, stimulusFatigue: 1.3 },
  { name: 'Front Raises (Dumbbells)', category: 'Push', muscles: { 'Front Delts': 1 }, stimulusFatigue: 0.5 },
  { name: 'Lu Raises', category: 'Push', muscles: { 'Front Delts': 1, 'Side Delts': 0.6 }, stimulusFatigue: 0.8 },
  { name: 'Pike Pushups', category: 'Push', muscles: { 'Front Delts': 1, 'Side Delts': 0.4, Triceps: 0.6, Core: 0.3 }, stimulusFatigue: 1.1 },
  { name: 'Handstand Pushups', category: 'Push', muscles: { 'Front Delts': 1, 'Side Delts': 0.5, Triceps: 0.8, Core: 0.4 }, stimulusFatigue: 1.5 },
  { name: 'Lateral Raise', category: 'Push', muscles: { 'Side Delts': 1 }, stimulusFatigue: 0.5 },
  { name: 'Lateral Raises (Cable)', category: 'Push', muscles: { 'Side Delts': 1 }, stimulusFatigue: 0.5 },
  { name: 'Incline Lateral Raises (Dumbbells)', category: 'Push', muscles: { 'Side Delts': 1 }, stimulusFatigue: 0.5 },  { name: 'Face Pulls with Rope (Cable)', category: 'Pull', muscles: { 'Rear Delts': 1, 'Upper Back': 0.3, Traps: 0.2 }, stimulusFatigue: 0.6 },
  { name: 'Reverse Flyes (Dumbbells)', category: 'Pull', muscles: { 'Rear Delts': 1, 'Upper Back': 0.2, Traps: 0.1 }, stimulusFatigue: 0.6 },
  { name: 'Rear Delt Flyes (Cable)', category: 'Pull', muscles: { 'Rear Delts': 1 }, stimulusFatigue: 0.6 },
  { name: 'Rear Delt Rows', category: 'Pull', muscles: { 'Rear Delts': 1, 'Upper Back': 0.3, Traps: 0.2 }, stimulusFatigue: 0.7 },

  // =============================================================================
  // TRICEPS EXERCISES
  // =============================================================================
  { name: 'Close Grip Bench Press', category: 'Push', muscles: { Triceps: 1, Chest: 0.6, 'Front Delts': 0.4 }, stimulusFatigue: 1.0 },
  { name: 'Diamond Pushups', category: 'Push', muscles: { Triceps: 1, Chest: 0.6, 'Front Delts': 0.3, Core: 0.2 }, stimulusFatigue: 1.0 },
  { name: 'Tricep Dips (Bench)', category: 'Push', muscles: { Triceps: 1, Chest: 0.4, 'Front Delts': 0.3 }, stimulusFatigue: 0.9 },
  { name: 'Skull Crushers (Dumbbells)', category: 'Arms', muscles: { Triceps: 1 }, stimulusFatigue: 1.0 },
  { name: 'Lying Triceps Extension', category: 'Arms', muscles: { Triceps: 1 }, stimulusFatigue: 1.0 },
  { name: 'Overhead Tricep Extension (Dumbbell)', category: 'Arms', muscles: { Triceps: 1, Core: 0.1 }, stimulusFatigue: 0.9 },
  { name: 'Overhead Triceps Extensions (Cable)', category: 'Arms', muscles: { Triceps: 1 }, stimulusFatigue: 0.9 },
  { name: 'Triceps Pushdown (Rope)', category: 'Arms', muscles: { Triceps: 1 }, stimulusFatigue: 0.8 },
  { name: 'Raise Extension (Dumbbells)', category: 'Push', muscles: { 'Front Delts': 1, Triceps: 0.7 }, stimulusFatigue: 1.0 },

  // =============================================================================
  // BICEPS EXERCISES
  // =============================================================================
  { name: 'Barbell Curl', category: 'Arms', muscles: { Biceps: 1, Forearms: 0.1 }, stimulusFatigue: 1.0 },
  { name: 'Curls (EZ Bar)', category: 'Arms', muscles: { Biceps: 1, Forearms: 0.1 }, stimulusFatigue: 1.0 },
  { name: 'Incline Dumbbell Curl', category: 'Arms', muscles: { Biceps: 1, Forearms: 0.1 }, stimulusFatigue: 0.9 },
  { name: 'Preacher Curls', category: 'Arms', muscles: { Biceps: 1, Forearms: 0.2 }, stimulusFatigue: 0.9 },
  { name: 'Cable Bicep Curls', category: 'Arms', muscles: { Biceps: 1, Forearms: 0.1 }, stimulusFatigue: 0.8 },
  { name: 'Concentration Curls', category: 'Arms', muscles: { Biceps: 1, Forearms: 0.1 }, stimulusFatigue: 0.7 },
  { name: 'Lying Dumbbell Curl', category: 'Arms', muscles: { Biceps: 1 }, stimulusFatigue: 0.8 },
  { name: 'Clown Curl', category: 'Arms', muscles: { Biceps: 1, Forearms: 0.2 }, stimulusFatigue: 0.8 },  { name: 'Hammer Curls', category: 'Arms', muscles: { Biceps: 0.7, Forearms: 0.3 }, stimulusFatigue: 0.8 },
  { name: 'Chin-Ups', category: 'Pull', muscles: { 'Upper Back': 1, Biceps: 0.8, Forearms: 0.3, Core: 0.1 }, stimulusFatigue: 1.1 },

  // =============================================================================
  // UPPER BACK EXERCISES
  // =============================================================================  
  { name: 'Barbell Row', category: 'Pull', muscles: { 'Upper Back': 1, Biceps: 0.5, 'Rear Delts': 0.3, 'Lower Back': 0.2, Forearms: 0.1 }, stimulusFatigue: 1.3 },
  { name: 'Pendlay Rows (Barbell)', category: 'Pull', muscles: { 'Upper Back': 1, 'Rear Delts': 0.3, 'Lower Back': 0.3, Biceps: 0.2, Forearms: 0.1 }, stimulusFatigue: 1.4 },
  { name: 'T-Bar Row', category: 'Pull', muscles: { 'Upper Back': 1, Biceps: 0.5, 'Rear Delts': 0.4, 'Lower Back': 0.3, Forearms: 0.2 }, stimulusFatigue: 1.3 },
  { name: 'One-Arm Dumbbell Row', category: 'Pull', muscles: { 'Upper Back': 1, Biceps: 0.5, 'Rear Delts': 0.3, Core: 0.2, Forearms: 0.1 }, stimulusFatigue: 1.0 },  { name: 'Seated Cable Row (Wide Grip)', category: 'Pull', muscles: { 'Upper Back': 1, 'Rear Delts': 0.4, Biceps: 0.3, Traps: 0.2, 'Lower Back': 0.3, Forearms: 0.1 }, stimulusFatigue: 1.0 },
  { name: 'Rows with Close Grip (Cable)', category: 'Pull', muscles: { 'Upper Back': 1, Biceps: 0.5, 'Rear Delts': 0.1 }, stimulusFatigue: 1.0 },
  { name: 'Chest-Supported Row', category: 'Pull', muscles: { 'Upper Back': 1, Biceps: 0.4, 'Rear Delts': 0.3, Forearms: 0.1 }, stimulusFatigue: 0.9 },
  { name: 'Machine Row', category: 'Pull', muscles: { 'Upper Back': 1, Biceps: 0.4, 'Rear Delts': 0.2 }, stimulusFatigue: 0.9 },  { name: 'Inverted Rows', category: 'Pull', muscles: { 'Upper Back': 1, Biceps: 0.4, 'Rear Delts': 0.3, Core: 0.2 }, stimulusFatigue: 0.8 },
  { name: 'Meadows Row', category: 'Pull', muscles: { 'Upper Back': 1, Biceps: 0.4, 'Rear Delts': 0.3, Core: 0.3, Forearms: 0.2 }, stimulusFatigue: 1.1 },
  { name: 'Landmine Row', category: 'Pull', muscles: { 'Upper Back': 1, Biceps: 0.5, 'Rear Delts': 0.3, Core: 0.4, Forearms: 0.2 }, stimulusFatigue: 1.2 },
  { name: 'Seal Row', category: 'Pull', muscles: { 'Upper Back': 1, Biceps: 0.4, 'Rear Delts': 0.3, Forearms: 0.1 }, stimulusFatigue: 1.0 },  { name: 'Pull-Up', category: 'Pull', muscles: { 'Upper Back': 1, Biceps: 0.5, Forearms: 0.3, Core: 0.1 }, stimulusFatigue: 1.0 },
  { name: 'Pull-Ups with Close Overhand Grip', category: 'Pull', muscles: { 'Upper Back': 1, Biceps: 0.5, Forearms: 0.3 }, stimulusFatigue: 1.0 },
  { name: 'Lat Pulldowns (Cable)', category: 'Pull', muscles: { 'Upper Back': 1, Biceps: 0.3 }, stimulusFatigue: 0.9 },
  { name: 'Lat Pullovers (EZ Bar)', category: 'Pull', muscles: { 'Upper Back': .5, Chest: .5, Triceps: 0.5 }, stimulusFatigue: 0.9 },  { name: 'Lat Pullovers (DB)', category: 'Pull', muscles: { 'Upper Back': .5, Chest: .5, Triceps: 0.5 }, stimulusFatigue: 0.9 },
  { name: 'Lat Prayer (Cable)', category: 'Pull', muscles: { 'Upper Back': .5, Chest: .5, Triceps: 0.5 }, stimulusFatigue: 0.9 },
  { name: 'Deficit Deadlifts (Trap Bar)', category: 'Pull', muscles: { Hamstrings: 1, Glutes: 1, 'Upper Back': 1, 'Lower Back': 0.5, Core: 0.3, Traps: 0.2, Forearms: 0.2 }, stimulusFatigue: 2.1 },

  // =============================================================================
  // TRAPS EXERCISES
  // =============================================================================
  { name: 'Shrugs (Barbell)', category: 'Pull', muscles: { Traps: 1 }, stimulusFatigue: 0.7 },
  { name: 'Shrugs (Trap Bar)', category: 'Pull', muscles: { Traps: 1, Forearms: 0.2 }, stimulusFatigue: 0.8 },

  // =============================================================================
  // FOREARMS EXERCISES
  // =============================================================================
  { name: 'Wrist Curls (Barbell)', category: 'Arms', muscles: { Forearms: 1 }, stimulusFatigue: 0.6 },
  { name: 'Reverse Wrist Curls (Barbell)', category: 'Arms', muscles: { Forearms: 1 }, stimulusFatigue: 0.6 },
  { name: 'Wrist Roller', category: 'Arms', muscles: { Forearms: 1 }, stimulusFatigue: 0.7 },
  { name: "Gripper", category: 'Arms', muscles: { Forearms: 1 }, stimulusFatigue: 0.5 },

  // =============================================================================
  // QUADRICEPS EXERCISES
  // =============================================================================  
  { name: 'Squat', category: 'Legs', muscles: { Quads: 1, Glutes: 0.5, Core: 0.2, 'Lower Back': 0.5 }, stimulusFatigue: 2.0 },
  { name: 'Front Squat', category: 'Legs', muscles: { Quads: 1, Glutes: 0.5, Core: 0.4, 'Upper Back': 0.3, 'Front Delts': 0.2 }, stimulusFatigue: 1.9 },
  { name: 'Hack Squat (Machine)', category: 'Legs', muscles: { Quads: 1, Glutes: 0.4, Hamstrings: 0.1 }, stimulusFatigue: 1.4 },
  { name: 'Belt Squat', category: 'Legs', muscles: { Quads: 1, Glutes: 0.7, Hamstrings: 0.2 }, stimulusFatigue: 1.5 },
  { name: 'Leg Press (Machine)', category: 'Legs', muscles: { Quads: 1, Glutes: 0.5, Hamstrings: 0.2 }, stimulusFatigue: 1.2 },
  { name: 'Leg Extensions (Machine)', category: 'Legs', muscles: { Quads: 1 }, stimulusFatigue: 0.8 },
  { name: 'Walking Lunges', category: 'Legs', muscles: { Quads: 1, Glutes: 0.8, Hamstrings: 0.3, Core: 0.3, Calves: 0.2 }, stimulusFatigue: 1.3 },
  { name: 'Stationary Lunges', category: 'Legs', muscles: { Quads: 1, Glutes: 0.7, Hamstrings: 0.3, Core: 0.2 }, stimulusFatigue: 1.1 },
  { name: 'Reverse Lunges', category: 'Legs', muscles: { Quads: 1, Glutes: 0.8, Hamstrings: 0.4, Core: 0.2 }, stimulusFatigue: 1.2 },
  { name: 'Lateral Lunges', category: 'Legs', muscles: { Quads: 1, Glutes: 0.7, Hamstrings: 0.3, Core: 0.3 }, stimulusFatigue: 1.1 },
  { name: 'Bulgarian Split Squats (Smith Machine)', category: 'Legs', muscles: { Quads: 1, Glutes: 0.7, Core: 0.2 }, stimulusFatigue: 1.3 },
  { name: 'Reverse Nordic Hamstring Curl', category: 'Legs', muscles: { Quads: 1, Core: 0.3, Hamstrings: 0.2 }, stimulusFatigue: 1.2 },  { name: 'Sumo Deadlift', category: 'Pull', muscles: { Glutes: 1, Hamstrings: 0.8, Quads: 0.6, 'Upper Back': 0.4, 'Lower Back': 0.7, Core: 0.3, Traps: 0.2, Forearms: 0.2 }, stimulusFatigue: 1.9 },

  // =============================================================================
  // HAMSTRINGS EXERCISES
  // =============================================================================
  { name: 'Deadlift', category: 'Pull', muscles: { Hamstrings: 1, Glutes: 1, 'Upper Back': 0.5, 'Lower Back': 0.7, Core: 0.3, Traps: 0.2, Forearms: 0.2 }, stimulusFatigue: 2.0 },
  { name: 'Romanian Deadlift', category: 'Pull', muscles: { Hamstrings: 1, Glutes: 0.8, 'Lower Back': 0.4, Forearms: 0.2, Traps: 0.1, Core: 0.2 }, stimulusFatigue: 1.5 },
  { name: 'Stiff Leg Deadlift', category: 'Pull', muscles: { Hamstrings: 1, Glutes: 0.7, 'Lower Back': 0.5, Core: 0.2, Forearms: 0.2 }, stimulusFatigue: 1.4 },
  { name: 'Leg Curl', category: 'Legs', muscles: { Hamstrings: 1 }, stimulusFatigue: 0.7 },  { name: 'Lying Leg Curls (Machine)', category: 'Legs', muscles: { Hamstrings: 1 }, stimulusFatigue: 0.7 },
  { name: 'Glute Ham Raise', category: 'Legs', muscles: { Hamstrings: 0.7, Glutes: 1, 'Lower Back': 0.3, Core: 0.2 }, stimulusFatigue: 1.1 },

  // =============================================================================
  // GLUTES EXERCISES
  // =============================================================================
  { name: 'Barbell Hip Thrust', category: 'Legs', muscles: { Glutes: 1, Hamstrings: 0.3, Quads: 0.1, Core: 0.2 }, stimulusFatigue: 1.0 },

  // =============================================================================
  // CALVES EXERCISES
  // =============================================================================
  { name: 'Standing Calf Raises (Machine)', category: 'Legs', muscles: { Calves: 1 }, stimulusFatigue: 0.6 },
  { name: 'Calf Raises on Leg Press (Machine)', category: 'Legs', muscles: { Calves: 1 }, stimulusFatigue: 0.6 },
  // =============================================================================
  // LOWER BACK EXERCISES
  // =============================================================================
  { name: 'Good Morning', category: 'Pull', muscles: { 'Lower Back': 1, Hamstrings: 0.8, Glutes: 0.6, Core: 0.3 }, stimulusFatigue: 1.2 },
  { name: 'Hyperextensions on Roman Chair', category: 'Pull', muscles: { Glutes: 0.5, 'Lower Back': 1, Hamstrings: 0.3 }, stimulusFatigue: 0.9 },

  // =============================================================================
  // CORE EXERCISES
  // =============================================================================
  { name: 'Cable Crunch', category: 'Core', muscles: { Core: 1, Forearms: 0.3, 'Upper Back': 0.2 }, stimulusFatigue: 1.1 },  { name: 'Hanging Leg Raises', category: 'Core', muscles: { Core: 1, Forearms: 0.3, 'Upper Back': 0.2 }, stimulusFatigue: 1.1 },
  { name: 'Ab Wheel Rollouts', category: 'Core', muscles: { Core: 1, 'Front Delts': 0.4, Triceps: 0.3, 'Upper Back': 0.2 }, stimulusFatigue: 1.3 },

  // =============================================================================
  // FULL BODY EXERCISES
  // =============================================================================
  { name: 'Farmers Walk', category: 'Full Body', muscles: { Forearms: 1, Traps: 0.5, Core: 0.5, Quads: 0.2, Hamstrings: 0.2, Glutes: 0.2, 'Upper Back': 0.1, 'Lower Back': 0.1 }, stimulusFatigue: 1.8 }
];

export const MUSCLE_GROUPS: MuscleGroup[] = [
  'Chest',
  'Front Delts',
  'Side Delts',
  'Rear Delts',
  'Biceps',
  'Triceps',
  'Forearms',
  'Traps',
  'Upper Back',
  'Lower Back',
  'Core',
  'Glutes',
  'Quads',
  'Hamstrings',
  'Calves',
];

// Complete workout volume recommendations
export const WORKOUT_VOLUME_DATA: Record<MuscleGroup, WorkoutVolumeData> = {
  'Chest': {
    maintenanceVolume: 4,
    minimumEffectiveVolume: 6,
    maximumAdaptiveVolume: { min: 7, max: 19 },
    maximumRecoverableVolume: { min: 20, max: 35 },
    frequency: { min: 2, max: 3 }
  },
  'Front Delts': {
    maintenanceVolume: 0,
    minimumEffectiveVolume: 0,
    maximumAdaptiveVolume: { min: 0, max: 15 },
    maximumRecoverableVolume: { min: 16, max: 30 },
    frequency: { min: 2, max: 6 }
  },
  'Side Delts': {
    maintenanceVolume: 6,
    minimumEffectiveVolume: 8,
    maximumAdaptiveVolume: { min: 9, max: 24 },
    maximumRecoverableVolume: { min: 25, max: 40 },
    frequency: { min: 3, max: 6 }
  },
  'Rear Delts': {
    maintenanceVolume: 0,
    minimumEffectiveVolume: 6,
    maximumAdaptiveVolume: { min: 7, max: 17 },
    maximumRecoverableVolume: { min: 18, max: 35 },
    frequency: { min: 2, max: 5 }
  },
  'Biceps': {
    maintenanceVolume: 4,
    minimumEffectiveVolume: 8,
    maximumAdaptiveVolume: { min: 9, max: 19 },
    maximumRecoverableVolume: { min: 20, max: 35 },
    frequency: { min: 2, max: 3 }
  },
  'Triceps': {
    maintenanceVolume: 4,
    minimumEffectiveVolume: 6,
    maximumAdaptiveVolume: { min: 7, max: 19 },
    maximumRecoverableVolume: { min: 20, max: 35 },
    frequency: { min: 2, max: 6 }
  },
  'Forearms': {
    maintenanceVolume: 0,
    minimumEffectiveVolume: 2,
    maximumAdaptiveVolume: { min: 9, max: 19 },
    maximumRecoverableVolume: { min: 20, max: 35 },
    frequency: { min: 2, max: 6 }
  },
  'Traps': {
    maintenanceVolume: 0,
    minimumEffectiveVolume: 4,
    maximumAdaptiveVolume: { min: 7, max: 24 },
    maximumRecoverableVolume: { min: 25, max: 35 },
    frequency: { min: 2, max: 6 }
  },
  'Upper Back': {
    maintenanceVolume: 6,
    minimumEffectiveVolume: 10,
    maximumAdaptiveVolume: { min: 11, max: 19 },
    maximumRecoverableVolume: { min: 20, max: 35 },
    frequency: { min: 2, max: 4 }
  },
  'Lower Back': {
    maintenanceVolume: 0,
    minimumEffectiveVolume: 0,
    maximumAdaptiveVolume: { min: 2, max: 10 },
    maximumRecoverableVolume: { min: 11, max: 20 },
    frequency: { min: 1, max: 3 }
  },
  'Core': {
    maintenanceVolume: 0,
    minimumEffectiveVolume: 0,
    maximumAdaptiveVolume: { min: 7, max: 24 },
    maximumRecoverableVolume: { min: 25, max: 35 },
    frequency: { min: 2, max: 6 }
  },
  'Glutes': {
    maintenanceVolume: 0,
    minimumEffectiveVolume: 0,
    maximumAdaptiveVolume: { min: 4, max: 16 },
    maximumRecoverableVolume: { min: 17, max: 30 },
    frequency: { min: 1, max: 3 }
  },
  'Quads': {
    maintenanceVolume: 6,
    minimumEffectiveVolume: 8,
    maximumAdaptiveVolume: { min: 9, max: 17 },
    maximumRecoverableVolume: { min: 18, max: 30 },
    frequency: { min: 2, max: 3 }
  },
  'Hamstrings': {
    maintenanceVolume: 3,
    minimumEffectiveVolume: 4,
    maximumAdaptiveVolume: { min: 5, max: 12 },
    maximumRecoverableVolume: { min: 13, max: 18 },
    frequency: { min: 2, max: 3 }
  },
  'Calves': {
    maintenanceVolume: 0,
    minimumEffectiveVolume: 2,
    maximumAdaptiveVolume: { min: 9, max: 19 },
    maximumRecoverableVolume: { min: 20, max: 35 },
    frequency: { min: 2, max: 6 }
  }
};

// Utility functions for working with the data
export class VolumeCalculator {
  
  static getMaintenanceVolume(muscle: MuscleGroup): number {
    return WORKOUT_VOLUME_DATA[muscle].maintenanceVolume;
  }
  
  static getMinimumEffectiveVolume(muscle: MuscleGroup): number {
    return WORKOUT_VOLUME_DATA[muscle].minimumEffectiveVolume;
  }
  
  static getOptimalVolumeRange(muscle: MuscleGroup): VolumeRange {
    return WORKOUT_VOLUME_DATA[muscle].maximumAdaptiveVolume;
  }
  
  static getMaxRecoverableVolume(muscle: MuscleGroup): VolumeRange {
    return WORKOUT_VOLUME_DATA[muscle].maximumRecoverableVolume;
  }
  
  static getRecommendedFrequency(muscle: MuscleGroup): FrequencyRange {
    return WORKOUT_VOLUME_DATA[muscle].frequency;
  }
  
  static getOptimalVolumeForLevel(muscle: MuscleGroup, level: 'beginner' | 'intermediate' | 'advanced'): number {
    const data = WORKOUT_VOLUME_DATA[muscle];
    
    switch (level) {
      case 'beginner':
        return data.minimumEffectiveVolume;
      case 'intermediate':
        return Math.round((data.maximumAdaptiveVolume.min + data.maximumAdaptiveVolume.max) / 2);
      case 'advanced':
        return data.maximumAdaptiveVolume.max;
      default:
        return data.minimumEffectiveVolume;
    }
  }
  
  static isVolumeInOptimalRange(muscle: MuscleGroup, volume: number): boolean {
    const range = WORKOUT_VOLUME_DATA[muscle].maximumAdaptiveVolume;
    return volume >= range.min && volume <= range.max;
  }
  
  static isVolumeRecoverable(muscle: MuscleGroup, volume: number): boolean {
    const range = WORKOUT_VOLUME_DATA[muscle].maximumRecoverableVolume;
    return volume <= range.max;
  }
  
  static getVolumeRecommendation(muscle: MuscleGroup, volume: number): string {
    const data = WORKOUT_VOLUME_DATA[muscle];
    
    if (volume < data.minimumEffectiveVolume) {
      return "Below minimum effective volume - increase for growth";
    } else if (volume >= data.minimumEffectiveVolume && volume < data.maximumAdaptiveVolume.min) {
      return "In growth range but could increase for better results";
    } else if (this.isVolumeInOptimalRange(muscle, volume)) {
      return "In optimal growth range";
    } else if (volume > data.maximumAdaptiveVolume.max && volume <= data.maximumRecoverableVolume.max) {
      return "High volume - monitor recovery carefully";
    } else {
      return "Volume may exceed recovery capacity - consider reducing";
    }
  }
}

export const LOCAL_STORAGE_ROUTINES_KEY = 'workoutApp_savedRoutines';
export const LOCAL_STORAGE_EXERCISES_KEY = 'workoutApp_exercises';
export const LOCAL_STORAGE_CYCLES_KEY = 'workoutApp_cycles';

export const SET_TYPES = ['Regular', 'Dropset', 'Myo-rep', 'Myo-rep match'] as const;

export type SetType = typeof SET_TYPES[number];

export const categoryColors: Record<ExerciseCategory, string> = {
  'Push': 'bg-gradient-to-r from-blue-500 to-purple-500',
  'Pull': 'bg-gradient-to-r from-green-500 to-teal-500',
  'Legs': 'bg-gradient-to-r from-orange-500 to-red-500',
  'Arms': 'bg-gradient-to-r from-pink-500 to-rose-500',
  'Full Body': 'bg-gradient-to-r from-violet-500 to-indigo-500',
  'Uncategorized': 'bg-gradient-to-r from-gray-500 to-slate-500'
};

export const muscleColors: Record<string, string> = {
  Chest: '#3b82f6',
  'Front Delts': '#8b5cf6',
  'Side Delts': '#a855f7',
  'Rear Delts': '#d946ef',
  Biceps: '#f43f5e',
  Triceps: '#ef4444',
  Forearms: '#84cc16',
  Traps: '#14b8a6',
  'Upper Back': '#6366f1',
  'Lower Back': '#06b6d4',
  Core: '#0ea5e9',
  Glutes: '#facc15',
  Quads: '#f97316',
  Hamstrings: '#fb923c',
  Calves: '#22c55e'
};

export const DEFAULT_CYCLES: WorkoutWeek[] = [
  {
    "name": "Micro Cycle 1",
    "days": [
      {
        "name": "Push A",
        "exercises": [
          {
            "name": "Cambered Bar Bench Press",
            "sets": 3,
            "setType": "Regular",
            "intensityType": "rir",
            "rir": 2,
            "rpe": 8,
            "percentage": 80
          },
          {
            "name": "Arnold Press (Dumbbells)",
            "sets": 3,
            "setType": "Regular",
            "intensityType": "rir",
            "rir": 2,
            "rpe": 8,
            "percentage": 80
          },
          {
            "name": "Dips (Bodyweight)",
            "sets": 3,
            "setType": "Regular",
            "intensityType": "rir",
            "rir": 2,
            "rpe": 8,
            "percentage": 80
          },
          {
            "name": "Lateral Raise",
            "sets": 4,
            "setType": "Regular",
            "intensityType": "rir",
            "rir": 2,
            "rpe": 8,
            "percentage": 80,
            "superset": true
          },
          {
            "name": "Lat Pullovers (EZ Bar)",
            "sets": 4,
            "setType": "Regular",
            "intensityType": "rir",
            "rir": 2,
            "rpe": 8,
            "percentage": 80,
            "superset": true
          },
          {
            "name": "Wrist Curls (Barbell)",
            "sets": 3,
            "setType": "Regular",
            "intensityType": "rir",
            "rir": 2,
            "rpe": 8,
            "percentage": 80
          }
        ]
      },
      {
        "name": "Legs A",
        "exercises": [
          {
            "name": "Squat",
            "sets": 3,
            "setType": "Regular",
            "intensityType": "rir",
            "rir": 2,
            "rpe": 8,
            "percentage": 80
          },
          {
            "name": "Romanian Deadlift",
            "sets": 3,
            "setType": "Regular",
            "intensityType": "rir",
            "rir": 2,
            "rpe": 8,
            "percentage": 80,
            "superset": true
          },
          {
            "name": "Shrugs (Barbell)",
            "sets": 3,
            "setType": "Regular",
            "intensityType": "rir",
            "rir": 2,
            "rpe": 8,
            "percentage": 80
          },
          {
            "name": "Bulgarian Split Squats (Smith Machine)",
            "sets": 3,
            "setType": "Regular",
            "intensityType": "rir",
            "rir": 2,
            "rpe": 8,
            "percentage": 80
          },
          {
            "name": "Leg Extensions (Machine)",
            "sets": 3,
            "setType": "Regular",
            "intensityType": "rir",
            "rir": 2,
            "rpe": 8,
            "percentage": 80
          },
          {
            "name": "Lying Leg Curls (Machine)",
            "sets": 3,
            "setType": "Regular",
            "intensityType": "rir",
            "rir": 2,
            "rpe": 8,
            "percentage": 80
          },
          {
            "name": "Standing Calf Raises (Machine)",
            "sets": 3,
            "setType": "Regular",
            "intensityType": "rir",
            "rir": 2,
            "rpe": 8,
            "percentage": 80
          },
          {
            "name": "Cable Crunch",
            "sets": 3,
            "setType": "Regular",
            "intensityType": "rir",
            "rir": 2,
            "rpe": 8,
            "percentage": 80
          }
        ]
      },
      {
        "name": "Pull A",
        "exercises": [
          {
            "name": "Barbell Row",
            "sets": 3,
            "setType": "Regular",
            "intensityType": "rir",
            "rir": 2,
            "rpe": 8,
            "percentage": 80,
            "superset": true
          },
          {
            "name": "Shrugs (Barbell)",
            "sets": 3,
            "setType": "Regular",
            "intensityType": "rir",
            "rir": 2,
            "rpe": 8,
            "percentage": 80
          },
          {
            "name": "Pull-Up",
            "sets": 3,
            "setType": "Regular",
            "intensityType": "rir",
            "rir": 2,
            "rpe": 8,
            "percentage": 80
          },
          {
            "name": "Face Pulls with Rope (Cable)",
            "sets": 3,
            "setType": "Regular",
            "intensityType": "rir",
            "rir": 2,
            "rpe": 8,
            "percentage": 80
          },
          {
            "name": "Lat Prayer (Cable)",
            "sets": 3,
            "setType": "Regular",
            "intensityType": "rir",
            "rir": 2,
            "rpe": 8,
            "percentage": 80,
            "superset": true
          },
          {
            "name": "Cable Bicep Curls",
            "sets": 3,
            "setType": "Regular",
            "intensityType": "rir",
            "rir": 2,
            "rpe": 8,
            "percentage": 80
          },
          {
            "name": "Standing Calf Raises (Machine)",
            "sets": 3,
            "setType": "Regular",
            "intensityType": "rir",
            "rir": 2,
            "rpe": 8,
            "percentage": 80
          }
        ]
      },
      {
        "name": "Push B",
        "exercises": [
          {
            "name": "Push Press (Barbell)",
            "sets": 3,
            "setType": "Regular",
            "intensityType": "rir",
            "rir": 2,
            "rpe": 8,
            "percentage": 80
          },
          {
            "name": "Dumbbell Bench Press",
            "sets": 3,
            "setType": "Regular",
            "intensityType": "rir",
            "rir": 2,
            "rpe": 8,
            "percentage": 80
          },
          {
            "name": "Cable Fly",
            "sets": 3,
            "setType": "Regular",
            "intensityType": "rir",
            "rir": 2,
            "rpe": 8,
            "percentage": 80,
            "superset": true
          },
          {
            "name": "Lateral Raises (Cable)",
            "sets": 3,
            "setType": "Regular",
            "intensityType": "rir",
            "rir": 2,
            "rpe": 8,
            "percentage": 80
          },
          {
            "name": "Overhead Triceps Extensions (Cable)",
            "sets": 3,
            "setType": "Regular",
            "intensityType": "rir",
            "rir": 2,
            "rpe": 8,
            "percentage": 80,
            "superset": true
          },
          {
            "name": "Rear Delt Flyes (Cable)",
            "sets": 3,
            "setType": "Regular",
            "intensityType": "rir",
            "rir": 2,
            "rpe": 8,
            "percentage": 80
          }
        ]
      },
      {
        "name": "Legs B",
        "exercises": [
          {
            "name": "Deadlift",
            "sets": 1,
            "setType": "Regular",
            "intensityType": "rir",
            "rir": 2,
            "rpe": 8,
            "percentage": 80
          },
          {
            "name": "Deficit Deadlifts (Trap Bar)",
            "sets": 3,
            "setType": "Regular",
            "intensityType": "rir",
            "rir": 2,
            "rpe": 8,
            "percentage": 80
          },
          {
            "name": "Leg Press (Machine)",
            "sets": 4,
            "setType": "Regular",
            "intensityType": "rir",
            "rir": 2,
            "rpe": 8,
            "percentage": 80,
            "superset": true
          },
          {
            "name": "Calf Raises on Leg Press (Machine)",
            "sets": 4,
            "setType": "Regular",
            "intensityType": "rir",
            "rir": 2,
            "rpe": 8,
            "percentage": 80
          },
          {
            "name": "Glute Ham Raise",
            "sets": 3,
            "setType": "Regular",
            "intensityType": "rir",
            "rir": 2,
            "rpe": 8,
            "percentage": 80
          },
          {
            "name": "Cable Crunch",
            "sets": 3,
            "setType": "Regular",
            "intensityType": "rir",
            "rir": 2,
            "rpe": 8,
            "percentage": 80,
            "superset": true
          },
          {
            "name": "Wrist Curls (Barbell)",
            "sets": 3,
            "setType": "Regular",
            "intensityType": "rir",
            "rir": 2,
            "rpe": 8,
            "percentage": 80
          }
        ]
      },
      {
        "name": "Pull B",
        "exercises": [
          {
            "name": "Pull-Up",
            "sets": 3,
            "setType": "Regular",
            "intensityType": "rir",
            "rir": 2,
            "rpe": 8,
            "percentage": 80
          },
          {
            "name": "Machine Row",
            "sets": 3,
            "setType": "Regular",
            "intensityType": "rir",
            "rir": 2,
            "rpe": 8,
            "percentage": 80
          },
          {
            "name": "Shrugs (Barbell)",
            "sets": 3,
            "setType": "Regular",
            "intensityType": "rir",
            "rir": 2,
            "rpe": 8,
            "percentage": 80
          },
          {
            "name": "Cable Bicep Curls",
            "sets": 3,
            "setType": "Regular",
            "intensityType": "rir",
            "rir": 2,
            "rpe": 8,
            "percentage": 80,
            "superset": true
          },
          {
            "name": "Lateral Raise",
            "sets": 3,
            "setType": "Regular",
            "intensityType": "rir",
            "rir": 2,
            "rpe": 8,
            "percentage": 80,
            "superset": true
          },
          {
            "name": "Rear Delt Flyes (Cable)",
            "sets": 3,
            "setType": "Regular",
            "intensityType": "rir",
            "rir": 2,
            "rpe": 8,
            "percentage": 80
          },
          {
            "name": "Raise Extension (Dumbbells)",
            "sets": 3,
            "setType": "Regular",
            "intensityType": "rir",
            "rir": 2,
            "rpe": 8,
            "percentage": 80,
            "superset": true
          },
          {
            "name": "Standing Calf Raises (Machine)",
            "sets": 3,
            "setType": "Regular",
            "intensityType": "rir",
            "rir": 2,
            "rpe": 8,
            "percentage": 80
          }
        ]
      }
    ]
  }
];


