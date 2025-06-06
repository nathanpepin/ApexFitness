import type { WorkoutExercise, Exercise, MuscleGroup, VolumeRecommendation, WorkoutVolumeData } from '@/types';
import { LOCAL_STORAGE_ROUTINES_KEY, LOCAL_STORAGE_EXERCISES_KEY } from '@/constants';

export const calculateVolume = (
  exercisesToCalc: WorkoutExercise[], 
  currentAllExercisesList: Exercise[]
): Record<string, number> => {
  const volumeMap: Record<string, number> = {};
  
  console.log('🔍 calculateVolume called with', exercisesToCalc.length, 'exercises');
  
  exercisesToCalc.forEach(workoutEx => {
    const exercise = currentAllExercisesList.find(ex => ex.name === workoutEx.name);
    if (exercise) {
      console.log(`✅ Found exercise: ${workoutEx.name}, sets: ${workoutEx.sets}, muscles:`, exercise.muscles);
      Object.entries(exercise.muscles).forEach(([muscle, contribution]) => {
        if (!volumeMap[muscle]) volumeMap[muscle] = 0;
        const contribution_volume = workoutEx.sets * contribution;
        volumeMap[muscle] += contribution_volume;
        if (muscle === 'Upper Back' || muscle === 'Lower Back') {
          console.log(`🎯 ${muscle}: ${workoutEx.name} adds ${contribution_volume} (${workoutEx.sets} sets × ${contribution} contribution)`);
        }
      });
    } else {
      console.log(`❌ Exercise not found in database: ${workoutEx.name}`);
    }
  });
  
  console.log('📊 Final volume map:', volumeMap);
  return volumeMap;
};

export const getVolumeStatusColor = (
  volume: number, 
  muscle: MuscleGroup,
  volumeRecommendations: Record<MuscleGroup, VolumeRecommendation>
): string => {
  const rec = volumeRecommendations[muscle];
  if (!rec) return 'text-gray-500';
  
  if (volume < rec.min) return 'text-red-500';
  if (volume >= rec.min && volume <= rec.max) return 'text-green-500';
  return 'text-orange-500';
};

export const getVolumeStatusStyling = (
  volume: number, 
  muscle: MuscleGroup,
  volumeRecommendations: Record<MuscleGroup, VolumeRecommendation>
): string => {
  const rec = volumeRecommendations[muscle];
  if (!rec) return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
  
  if (volume < rec.min) return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
  if (volume >= rec.min && volume <= rec.max) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
  return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
};

export const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return defaultValue;
  }
};

export const transformWorkoutVolumeDataToRecommendations = (
  workoutVolumeData: Record<MuscleGroup, WorkoutVolumeData>
): Record<MuscleGroup, VolumeRecommendation> => {
  const recommendations: Record<string, VolumeRecommendation> = {};
  
  Object.entries(workoutVolumeData).forEach(([muscle, data]) => {
    recommendations[muscle] = {
      min: data.maintenanceVolume,
      optimal: data.minimumEffectiveVolume, 
      max: data.maximumRecoverableVolume.max
    };
  });
  
  return recommendations as Record<MuscleGroup, VolumeRecommendation>;
};