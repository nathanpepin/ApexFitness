// IndexedDB utility for storing workout data
import type { Exercise, SavedRoutine, WorkoutWeek } from '@/types';

const DB_NAME = 'WorkoutTrackerDB';
const DB_VERSION = 1;

// Store names
const STORES = {
  EXERCISES: 'exercises',
  ROUTINES: 'routines',
  CYCLES: 'cycles'
} as const;

// Database interface
interface WorkoutDB extends IDBDatabase {
  transaction(storeNames: string | string[], mode?: IDBTransactionMode): IDBTransaction;
}

// Initialize IndexedDB
export const initDB = (): Promise<WorkoutDB> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error('Failed to open IndexedDB'));
    };

    request.onsuccess = () => {
      resolve(request.result as WorkoutDB);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result as WorkoutDB;

      // Create exercises store
      if (!db.objectStoreNames.contains(STORES.EXERCISES)) {
        const exerciseStore = db.createObjectStore(STORES.EXERCISES, { keyPath: 'name' });
        exerciseStore.createIndex('category', 'category', { unique: false });
      }

      // Create routines store
      if (!db.objectStoreNames.contains(STORES.ROUTINES)) {
        db.createObjectStore(STORES.ROUTINES, { keyPath: 'name' });
      }

      // Create cycles store
      if (!db.objectStoreNames.contains(STORES.CYCLES)) {
        db.createObjectStore(STORES.CYCLES, { keyPath: 'id' });
      }
    };
  });
};

// Generic database operations
const performDBOperation = async <T>(
  storeName: string,
  operation: (store: IDBObjectStore) => IDBRequest,
  mode: IDBTransactionMode = 'readonly'
): Promise<T> => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], mode);
    const store = transaction.objectStore(storeName);
    const request = operation(store);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(new Error(`Database operation failed: ${request.error?.message}`));
    };

    transaction.onerror = () => {
      reject(new Error(`Transaction failed: ${transaction.error?.message}`));
    };
  });
};

// Exercise operations
export const saveExercises = async (exercises: Exercise[]): Promise<void> => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.EXERCISES], 'readwrite');
    const store = transaction.objectStore(STORES.EXERCISES);

    // Clear existing exercises
    const clearRequest = store.clear();
    
    clearRequest.onsuccess = () => {
      // Add all exercises
      let completed = 0;
      const total = exercises.length;

      if (total === 0) {
        resolve();
        return;
      }

      exercises.forEach((exercise) => {
        const addRequest = store.add(exercise);
        
        addRequest.onsuccess = () => {
          completed++;
          if (completed === total) {
            resolve();
          }
        };

        addRequest.onerror = () => {
          reject(new Error(`Failed to save exercise: ${exercise.name}`));
        };
      });
    };

    clearRequest.onerror = () => {
      reject(new Error('Failed to clear existing exercises'));
    };

    transaction.onerror = () => {
      reject(new Error(`Transaction failed: ${transaction.error?.message}`));
    };
  });
};

export const loadExercises = async (): Promise<Exercise[]> => {
  return performDBOperation<Exercise[]>(
    STORES.EXERCISES,
    (store) => store.getAll()
  );
};

// Routine operations
export const saveRoutines = async (routines: SavedRoutine[]): Promise<void> => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.ROUTINES], 'readwrite');
    const store = transaction.objectStore(STORES.ROUTINES);

    // Clear existing routines
    const clearRequest = store.clear();
    
    clearRequest.onsuccess = () => {
      // Add all routines
      let completed = 0;
      const total = routines.length;

      if (total === 0) {
        resolve();
        return;
      }

      routines.forEach((routine) => {
        const addRequest = store.add(routine);
        
        addRequest.onsuccess = () => {
          completed++;
          if (completed === total) {
            resolve();
          }
        };

        addRequest.onerror = () => {
          reject(new Error(`Failed to save routine: ${routine.name}`));
        };
      });
    };

    clearRequest.onerror = () => {
      reject(new Error('Failed to clear existing routines'));
    };

    transaction.onerror = () => {
      reject(new Error(`Transaction failed: ${transaction.error?.message}`));
    };
  });
};

export const loadRoutines = async (): Promise<SavedRoutine[]> => {
  return performDBOperation<SavedRoutine[]>(
    STORES.ROUTINES,
    (store) => store.getAll()
  );
};

// Update a single routine (more efficient than saveRoutines for single updates)
export const updateRoutine = async (routine: SavedRoutine): Promise<void> => {
  return performDBOperation<void>(
    STORES.ROUTINES,
    (store) => store.put(routine),
    'readwrite'
  );
};

// Save/load currently selected routine name
export const saveSelectedRoutineName = async (routineName: string): Promise<void> => {
  return performDBOperation<void>(
    STORES.CYCLES,
    (store) => store.put({ id: 'selectedRoutine', routineName }),
    'readwrite'
  );
};

export const loadSelectedRoutineName = async (): Promise<string> => {
  try {
    const result = await performDBOperation<{ id: string; routineName: string } | undefined>(
      STORES.CYCLES,
      (store) => store.get('selectedRoutine')
    );
    
    return result?.routineName || '';
  } catch (error) {
    console.warn('Failed to load selected routine name from IndexedDB:', error);
    return '';
  }
};

// Cycles operations
export const saveCycles = async (cycles: WorkoutWeek[]): Promise<void> => {
  return performDBOperation<void>(
    STORES.CYCLES,
    (store) => store.put({ id: 'current', cycles }),
    'readwrite'
  );
};

export const loadCycles = async (): Promise<WorkoutWeek[]> => {
  try {
    const result = await performDBOperation<{ id: string; cycles: WorkoutWeek[] } | undefined>(
      STORES.CYCLES,
      (store) => store.get('current')
    );
    
    return result?.cycles || [];
  } catch (error) {
    console.warn('Failed to load cycles from IndexedDB:', error);
    return [];
  }
};

// Clear all data (for reset functionality)
export const clearAllData = async (): Promise<void> => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.EXERCISES, STORES.ROUTINES, STORES.CYCLES], 'readwrite');
    
    let completed = 0;
    const stores = [STORES.EXERCISES, STORES.ROUTINES, STORES.CYCLES];
    
    stores.forEach((storeName) => {
      const store = transaction.objectStore(storeName);
      const clearRequest = store.clear();
      
      clearRequest.onsuccess = () => {
        completed++;
        if (completed === stores.length) {
          resolve();
        }
      };
      
      clearRequest.onerror = () => {
        reject(new Error(`Failed to clear store: ${storeName}`));
      };
    });    transaction.onerror = () => {
      reject(new Error(`Transaction failed: ${transaction.error?.message}`));
    };
  });
};
