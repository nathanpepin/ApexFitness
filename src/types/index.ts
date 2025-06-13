// Type definitions for the workout tracker app

export interface Exercise {
  name: string;
  category: string;
  muscles: Record<string, number>;
  stimulusFatigue?: number; // SFR: 1 = baseline, 2 = high fatigue, 0.5 = low fatigue
}

export interface WorkoutExercise {  name: string;
  sets: number;
  setType?: 'Regular' | 'Dropset' | 'Myo-rep' | 'Myo-rep match';
  intensityType?: 'rir' | 'rpe' | 'percentage' | 'flow';
  rir?: number; // Reps in Reserve (0-10)
  rpe?: number; // Rate of Perceived Exertion (1-10)
  percentage?: number; // Percentage of 1RM (1-100)
  superset?: boolean; // Whether this exercise is part of a superset with the next exercise
}

export interface WorkoutDay {
  name: string;
  exercises: WorkoutExercise[];
}

export interface WorkoutWeek {
  name: string;
  days: WorkoutDay[];
}

export interface SavedRoutine {
  name: string;
  weeks: WorkoutWeek[];
}

// Enhanced type definitions
export interface VolumeRange {
  min: number;
  max: number;
}

export interface FrequencyRange {
  min: number;
  max: number;
}

export interface WorkoutVolumeData {
  maintenanceVolume: number;           // MV - Sets per week to maintain
  minimumEffectiveVolume: number;      // MEV - Minimum sets for growth
  maximumAdaptiveVolume: VolumeRange;  // MAV - Optimal growth range
  maximumRecoverableVolume: VolumeRange; // MRV - Maximum before overreaching
  frequency: FrequencyRange;           // Sessions per week
}

export interface VolumeRecommendation {
  min: number;      // Maintenance Volume (MV)
  optimal: number;  // Start of Maximum Adaptive Volume (MAV)
  max: number;      // Maximum Recoverable Volume (MRV)
}

export interface AppMessage {
  type: 'success' | 'error' | '';
  text: string;
}

export interface CategoryOption {
  name: string;
  exercises: Exercise[];
}

export interface RadarDataPoint {
  subject: string;
  A: number;
  B: number;
  fullMark: number;
}

export type MuscleGroup =
  | 'Chest'
  | 'Front Delts'
  | 'Side Delts'
  | 'Rear Delts'
  | 'Biceps'
  | 'Triceps'
  | 'Forearms'
  | 'Traps'
  | 'Upper Back'
  | 'Lower Back'
  | 'Core'
  | 'Glutes'
  | 'Quads'
  | 'Hamstrings'
  | 'Calves';

export type ExerciseCategory = 'Push' | 'Pull' | 'Legs' | 'Arms' | 'Full Body' | 'Uncategorized';

export type ViewType = 'tracker' | 'exercises';

export type SetType = 'Regular' | 'Dropset' | 'Myo-rep' | 'Myo-rep match';

export type IntensityType = 'rir' | 'rpe' | 'percentage';
