// Manual test for IndexedDB operations
import { 
  saveExercises, loadExercises, saveRoutines, loadRoutines, 
  saveCycles, loadCycles, clearAllData, isIndexedDBSupported 
} from './src/utils/indexedDB.js';

// Test data
const testExercises = [
  { name: 'Test Exercise 1', category: 'Push', muscles: { Chest: 1 }, stimulusFatigue: 1 },
  { name: 'Test Exercise 2', category: 'Pull', muscles: { UpperBack: 1 }, stimulusFatigue: 1 }
];

const testRoutines = [
  { name: 'Test Routine', workoutWeek: { days: [] } }
];

const testCycles = [
  { days: [{ name: 'Day 1', exercises: [] }] }
];

async function runTests() {
  console.log('Starting IndexedDB tests...');
  
  if (!isIndexedDBSupported()) {
    console.error('❌ IndexedDB not supported');
    return;
  }
  
  try {
    // Test clearing data
    console.log('🧹 Clearing all data...');
    await clearAllData();
    
    // Test saving exercises
    console.log('💾 Saving test exercises...');
    await saveExercises(testExercises);
    
    // Test loading exercises
    console.log('📖 Loading exercises...');
    const loadedExercises = await loadExercises();
    console.log('Loaded exercises:', loadedExercises.length);
    
    // Test saving routines
    console.log('💾 Saving test routines...');
    await saveRoutines(testRoutines);
    
    // Test loading routines
    console.log('📖 Loading routines...');
    const loadedRoutines = await loadRoutines();
    console.log('Loaded routines:', loadedRoutines.length);
    
    // Test saving cycles
    console.log('💾 Saving test cycles...');
    await saveCycles(testCycles);
    
    // Test loading cycles
    console.log('📖 Loading cycles...');
    const loadedCycles = await loadCycles();
    console.log('Loaded cycles:', loadedCycles.length);
    
    console.log('✅ All tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run tests when script is executed
runTests();
