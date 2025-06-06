// Test script to verify IndexedDB functionality
console.log('Testing IndexedDB functionality...');

// Test if IndexedDB is supported
if ('indexedDB' in window && indexedDB !== null) {
  console.log('✅ IndexedDB is supported');
  
  // Open the WorkoutTrackerDB database
  const request = indexedDB.open('WorkoutTrackerDB', 1);
  
  request.onsuccess = function(event) {
    const db = event.target.result;
    console.log('✅ Database opened successfully');
    console.log('Database name:', db.name);
    console.log('Database version:', db.version);
    console.log('Object stores:', Array.from(db.objectStoreNames));
    
    // Check if the expected stores exist
    const expectedStores = ['exercises', 'routines', 'cycles'];
    expectedStores.forEach(storeName => {
      if (db.objectStoreNames.contains(storeName)) {
        console.log(`✅ Store '${storeName}' exists`);
      } else {
        console.log(`❌ Store '${storeName}' missing`);
      }
    });
    
    db.close();
  };
  
  request.onerror = function(event) {
    console.error('❌ Failed to open database:', event.target.error);
  };
  
  request.onupgradeneeded = function(event) {
    console.log('🔄 Database upgrade needed');
  };
} else {
  console.log('❌ IndexedDB is not supported');
}

// Test localStorage data for migration
const localStorageKeys = [
  'workoutApp_exercises',
  'workoutApp_savedRoutines', 
  'workoutApp_cycles'
];

console.log('\nChecking localStorage data for migration:');
localStorageKeys.forEach(key => {
  const data = localStorage.getItem(key);
  if (data) {
    try {
      const parsed = JSON.parse(data);
      console.log(`✅ ${key}: ${Array.isArray(parsed) ? parsed.length + ' items' : 'exists'}`);
    } catch (e) {
      console.log(`⚠️ ${key}: exists but not valid JSON`);
    }
  } else {
    console.log(`➖ ${key}: not found`);
  }
});
