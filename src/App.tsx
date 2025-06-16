import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectGroup, 
  SelectLabel  
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge'; 
import { 
  Search, Plus, Trash2, ChevronUp, ChevronDown, Dumbbell, Calendar, TrendingUp, 
  Moon, Sun, Save, Upload, Download, Edit2, Check, X, Copy, Menu, BarChart3, 
  Library, Clock, Target, Sparkles, Edit3, GripVertical, Pin, PinOff, Info, 
  PanelRightOpen, PanelRightClose, Link 
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, Radar, Legend 
} from 'recharts';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { SearchableSelect } from '@/components/SearchableSelect';
import { WeeklySummarySidebar } from '@/components/WeeklySummarySidebar';
import { ExercisesListPage } from '@/components/ExercisesListPage';
import { MuscleStressTimeline } from '@/components/MuscleStressTimeline';
import { DailyStressChart } from '@/components/DailyStressChart';
import VolumeLandmarksBar from '@/components/VolumeLandmarksBar';
import { SimpleTooltip } from '@/components/ui/SimpleTooltip';
import { transformWorkoutVolumeDataToRecommendations } from '@/utils';
import { MuscleGroupIcon } from '@/components/ui/MuscleGroupIcon';
import { Tabs, TabsList, TabsTrigger, TabsContent, TabsContext } from './components/ui/tabs';
import MicroCycleManagement from '@/components/MicroCycleManagement';
import RoutineManagement from '@/components/RoutineManagement';
import AppMessageDisplay from '@/components/AppMessageDisplay';
import AppHeader from '@/components/AppHeader';
import DayCard from '@/components/DayCard';
import ExerciseRow from '@/components/ExerciseRow';
import ImportExportCard from '@/components/ImportExportCard';

import type { 
  Exercise, WorkoutExercise, WorkoutDay, WorkoutWeek, SavedRoutine, AppMessage, 
  CategoryOption, RadarDataPoint, MuscleGroup, ViewType, WorkoutVolumeData 
} from '@/types';
import { 
  DEFAULT_EXERCISES, MUSCLE_GROUPS, WORKOUT_VOLUME_DATA, 
  categoryColors, muscleColors, SET_TYPES, DEFAULT_CYCLES 
} from '@/constants';
import { 
  calculateVolume, getVolumeStatusColor, getVolumeStatusStyling
} from '@/utils';
import { 
  saveExercises, loadExercises, saveRoutines, loadRoutines, 
  saveCycles, loadCycles, clearAllData, updateRoutine,
  saveSelectedRoutineName, loadSelectedRoutineName
} from '@/utils/indexedDB';

export default function WorkoutVolumeTracker() {
  // State definitions
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [cycles, setCycles] = useState<WorkoutWeek[]>(DEFAULT_CYCLES);
  const [currentCycleIndex, setCurrentCycleIndex] = useState<number>(0);
  const [jsonError, setJsonError] = useState<string>('');
  const [jsonSuccess, setJsonSuccess] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentView, setCurrentView] = useState<ViewType>('tracker');
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
  const [allExercises, setAllExercises] = useState<Exercise[]>(DEFAULT_EXERCISES);
  const [savedRoutines, setSavedRoutines] = useState<SavedRoutine[]>([]);
  const [selectedRoutineName, setSelectedRoutineName] = useState<string>('');
  const [appMessage, setAppMessage] = useState<AppMessage>({ type: '', text: '' });
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const [isLoadingRoutine, setIsLoadingRoutine] = useState<boolean>(false);

  const [editingDayIndex, setEditingDayIndex] = useState<number | null>(null);
  const [currentEditingDayName, setCurrentEditingDayName] = useState<string>('');
  const [showWeeklySummarySidebar, setShowWeeklySummarySidebar] = useState<boolean>(true);
  // State for Save Routine Modal
  const [isSaveRoutineModalOpen, setIsSaveRoutineModalOpen] = useState<boolean>(false);
  const [newRoutineNameInput, setNewRoutineNameInput] = useState<string>('');

  // State for Muscle Stress Timeline Modal
  const [isMuscleStressTimelineOpen, setIsMuscleStressTimelineOpen] = useState<boolean>(false);
  // State for Reset Confirmation Dialog
  const [isResetDialogOpen, setIsResetDialogOpen] = useState<boolean>(false);

  // State for Rename Routine Modal
  const [isRenameRoutineModalOpen, setIsRenameRoutineModalOpen] = useState<boolean>(false);
  const [renameRoutineInput, setRenameRoutineInput] = useState<string>('');

  // Add state to track selected tab (day)
  const [selectedDayTab, setSelectedDayTab] = useState(0);
  // Drag and drop state
  const [draggedExercise, setDraggedExercise] = useState<{dayIndex: number, exerciseIndex: number} | null>(null);
  const [exerciseDragOver, setExerciseDragOver] = useState<{dayIndex: number, exerciseIndex: number} | null>(null);
  const [draggedDay, setDraggedDay] = useState<number | null>(null);
  const [dayDragOver, setDayDragOver] = useState<number | null>(null);
  const tabsCtx = React.useContext(TabsContext);
  React.useEffect(() => {
    if (!tabsCtx || !tabsCtx.active) return;
    const idx = Number(tabsCtx.active.replace('day-', ''));
    if (!isNaN(idx) && selectedDayTab !== idx) setSelectedDayTab(idx);
  }, [tabsCtx && tabsCtx.active]);

  // Effects
  useEffect(() => {
    // Load data from IndexedDB on first mount
    const loadData = async () => {
      try {
        const [exercises, routines, cycles, selectedRoutine] = await Promise.all([
          loadExercises(),
          loadRoutines(), 
          loadCycles(),
          loadSelectedRoutineName()
        ]);

        setAllExercises(exercises.length > 0 ? exercises : DEFAULT_EXERCISES);
        setSavedRoutines(routines);

        // If we have a selected routine, try to load it automatically
        if (selectedRoutine && routines.length > 0) {
          const foundRoutine = routines.find(r => r.name === selectedRoutine);
          if (foundRoutine) {
            setCycles(JSON.parse(JSON.stringify(foundRoutine.weeks)));
            setCurrentCycleIndex(0);
            setSelectedRoutineName(selectedRoutine);
            console.log(`Auto-loaded routine: ${selectedRoutine}`);
          } else {
            // Selected routine doesn't exist anymore, clear selection
            setCycles(cycles.length > 0 ? cycles : DEFAULT_CYCLES);
            setSelectedRoutineName('');
          }
        } else {
          setCycles(cycles.length > 0 ? cycles : DEFAULT_CYCLES);
          setSelectedRoutineName(selectedRoutine);
        }
      } catch (error) {
        console.error('Failed to load data from IndexedDB:', error);
        displayAppMessage('error', 'Failed to load data from database');

        // Use defaults on error
        setAllExercises(DEFAULT_EXERCISES);
        setSavedRoutines([]);
        setCycles(DEFAULT_CYCLES);
        setSelectedRoutineName('');
      } finally {
        setIsDataLoaded(true);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    // Save exercises to IndexedDB when they change (only after initial load)
    if (!isDataLoaded) return;

    const saveData = async () => {
      try {
        await saveExercises(allExercises);
      } catch (error) {
        console.error('Failed to save exercises:', error);
        displayAppMessage('error', 'Failed to save exercises');
      }
    };

    saveData();
  }, [allExercises, isDataLoaded]);

  useEffect(() => {
    // Save routines to IndexedDB when they change (only after initial load)
    if (!isDataLoaded) return;

    const saveData = async () => {
      try {
        await saveRoutines(savedRoutines);
      } catch (error) {
        console.error('Failed to save routines:', error);
        displayAppMessage('error', 'Failed to save routines');
      }
    };

    saveData();
  }, [savedRoutines, isDataLoaded]);

  useEffect(() => {
    // Save cycles to IndexedDB when they change (only after initial load)
    if (!isDataLoaded) return;

    const saveData = async () => {
      try {
        await saveCycles(cycles);
      } catch (error) {
        console.error('Failed to save cycles:', error);
        displayAppMessage('error', 'Failed to save cycles');
      }
    };

    saveData();
  }, [cycles, isDataLoaded]);

  useEffect(() => {
    // Save selected routine name to IndexedDB when it changes (only after initial load)
    if (!isDataLoaded) return;

    const saveData = async () => {
      try {
        await saveSelectedRoutineName(selectedRoutineName);
      } catch (error) {
        console.error('Failed to save selected routine name:', error);
      }
    };

    saveData();
  }, [selectedRoutineName, isDataLoaded]);

  // Auto-load routine when selectedRoutineName changes (after initial load)
  useEffect(() => {
    if (!isDataLoaded || !selectedRoutineName) return;

    const routine = savedRoutines.find(r => r.name === selectedRoutineName);
    if (routine) {
      // Only load if the current cycles don't match the selected routine
      const currentCyclesString = JSON.stringify(cycles);
      const routineCyclesString = JSON.stringify(routine.weeks);

      if (currentCyclesString !== routineCyclesString) {
        setIsLoadingRoutine(true);

        // Add a slight delay for better UX (show loading state)
        setTimeout(() => {
          setCycles(JSON.parse(JSON.stringify(routine.weeks)));
          setCurrentCycleIndex(0);
          setIsLoadingRoutine(false);
          console.log(`Auto-loaded routine: ${selectedRoutineName}`);
        }, 100);
      }
    }
  }, [selectedRoutineName, savedRoutines, isDataLoaded]);

  // Utility functions
  const displayAppMessage = useCallback((type: 'success' | 'error', text: string) => {
    setAppMessage({ type, text });
    setTimeout(() => setAppMessage({ type: '', text: '' }), 4000);
  }, []);

  const clearAppMessage = useCallback(() => {
    setAppMessage({ type: '', text: '' });
  }, []);

  // Helper function to get current micro cycle and days
  const currentCycle = cycles[currentCycleIndex] || { name: 'Micro Cycle 1', days: [] };
  const days = currentCycle.days;

  // Micro cycle management functions
  const addCycle = () => {
    setCycles(prev => [...prev, { 
      name: `Micro Cycle ${prev.length + 1}`, 
      days: [{ name: 'Day 1', exercises: [] }] 
    }]);
  };

  const deleteCycle = (cycleIndex: number) => {
    if (cycles.length <= 1) {
      displayAppMessage('error', 'You must have at least one micro cycle.');
      return;
    }
    setCycles(prev => prev.filter((_, idx) => idx !== cycleIndex));
    if (currentCycleIndex >= cycles.length - 1) {
      setCurrentCycleIndex(Math.max(0, cycles.length - 2));
    }
  };

  const copyCycle = (cycleIndex: number) => {
    const cycleToCopy = cycles[cycleIndex];
    if (!cycleToCopy) return;

    const copiedCycle: WorkoutWeek = {
      name: `${cycleToCopy.name} (Copy)`,
      days: cycleToCopy.days.map(day => ({
        name: day.name,
        exercises: day.exercises.map(ex => ({ ...ex }))
      }))
    };

    setCycles(prev => [...prev, copiedCycle]);
    displayAppMessage('success', `Micro Cycle "${cycleToCopy.name}" copied successfully!`);
  };

  // Day management functions - updated to work with current micro cycle
  const setDays = (updater: (prev: WorkoutDay[]) => WorkoutDay[]) => {
    setCycles(prev => prev.map((cycle, idx) => 
      idx === currentCycleIndex 
        ? { ...cycle, days: typeof updater === 'function' ? updater(cycle.days) : updater }
        : cycle
    ));
  };

  const copyDay = (dayIndex: number) => {
    const dayToCopy = days[dayIndex];
    if (!dayToCopy) return;

    const copiedDay: WorkoutDay = {
      name: `${dayToCopy.name} (Copy)`,
      exercises: dayToCopy.exercises.map(ex => ({ ...ex }))
    };

    setDays(prev => [...prev, copiedDay]);
    displayAppMessage('success', `Day "${dayToCopy.name}" copied successfully!`);
  };

  const copyExercise = (dayIndex: number, exIndex: number) => {
    const exerciseToCopy = days[dayIndex]?.exercises[exIndex];
    if (!exerciseToCopy) return;

    const copiedExercise: WorkoutExercise = { ...exerciseToCopy };

    setDays(prev => {
      const newDays = [...prev];
      newDays[dayIndex] = {
        ...newDays[dayIndex],
        exercises: [...newDays[dayIndex].exercises.slice(0, exIndex + 1), copiedExercise, ...newDays[dayIndex].exercises.slice(exIndex + 1)]
      };
      return newDays;
    });
    displayAppMessage('success', 'Exercise copied successfully!');
  };  const openSaveRoutineModal = useCallback(() => {
    setNewRoutineNameInput('');
    setIsSaveRoutineModalOpen(true);
  }, []);

  const handleCreateNewRoutine = useCallback(() => {
    // Clear current routine selection
    setSelectedRoutineName('');
    
    // Reset to a basic single micro cycle with one empty day
    const newEmptyRoutine: WorkoutWeek[] = [{
      name: 'Micro Cycle 1',
      days: [{
        name: 'Day 1',
        exercises: []
      }]
    }];
    
    setCycles(newEmptyRoutine);
    setCurrentCycleIndex(0);
    displayAppMessage('success', 'New routine created! Start adding exercises to build your workout.');
  }, [displayAppMessage]);
  const handleSaveCurrentRoutine = useCallback(async () => {
    if (selectedRoutineName) {
      // If a routine is selected, overwrite it directly
      const newRoutine: SavedRoutine = {
        name: selectedRoutineName,
        weeks: JSON.parse(JSON.stringify(cycles))
      };

      try {
        await updateRoutine(newRoutine);
        setSavedRoutines(prev => prev.map(routine => 
          routine.name === selectedRoutineName ? newRoutine : routine
        ));
        displayAppMessage('success', `Routine "${selectedRoutineName}" updated successfully!`);
      } catch (error) {
        console.error('Failed to update routine:', error);
        displayAppMessage('error', 'Failed to update routine');
      }
    } else {
      // If no routine is selected, open the modal to create a new one
      openSaveRoutineModal();
    }
  }, [selectedRoutineName, cycles, openSaveRoutineModal]);  const handleConfirmSaveRoutine = async () => {
    if (!newRoutineNameInput.trim()) {
      displayAppMessage('error', 'Please enter a routine name.');
      return;
    }

    const routineExists = savedRoutines.some(r => r.name.toLowerCase() === newRoutineNameInput.toLowerCase());
    if (routineExists) {
      displayAppMessage('error', 'A routine with this name already exists.');
      return;
    }

    const newRoutine: SavedRoutine = {
      name: newRoutineNameInput.trim(),
      weeks: JSON.parse(JSON.stringify(cycles))
    };

    try {
      // Update savedRoutines state
      const updatedRoutines = [...savedRoutines, newRoutine];
      setSavedRoutines(updatedRoutines);

      // Auto-select the newly created routine
      setSelectedRoutineName(newRoutine.name);

      // Save the updated routines to IndexedDB
      await saveRoutines(updatedRoutines);

      // Save the selected routine name to IndexedDB
      await saveSelectedRoutineName(newRoutine.name);

      setIsSaveRoutineModalOpen(false);
      displayAppMessage('success', `Routine "${newRoutine.name}" saved and selected!`);
    } catch (error) {
      console.error('Failed to save routine:', error);
      displayAppMessage('error', 'Failed to save routine');

      // Revert state changes on error
      setSavedRoutines(savedRoutines);
      setSelectedRoutineName('');
    }
  };

  const handleDeleteSelectedRoutine = () => {
    setSavedRoutines(savedRoutines.filter(r => r.name !== selectedRoutineName));
    setSelectedRoutineName('');
    displayAppMessage('success', 'Routine deleted successfully!');
  };

  const openRenameRoutineModal = useCallback(() => {
    setRenameRoutineInput(selectedRoutineName);
    setIsRenameRoutineModalOpen(true);
  }, [selectedRoutineName]);

  const handleConfirmRenameRoutine = async () => {
    if (!renameRoutineInput.trim()) {
      displayAppMessage('error', 'Please enter a routine name.');
      return;
    }

    const newName = renameRoutineInput.trim();

    // Check if the new name already exists (case insensitive, but exclude current routine)
    const routineExists = savedRoutines.some(r => 
      r.name.toLowerCase() === newName.toLowerCase() && 
      r.name !== selectedRoutineName
    );

    if (routineExists) {
      displayAppMessage('error', 'A routine with this name already exists.');
      return;
    }

    const oldName = selectedRoutineName;

    try {
      // Update the routine with the new name
      const updatedRoutines = savedRoutines.map(routine => 
        routine.name === oldName 
          ? { ...routine, name: newName }
          : routine
      );

      // Update state
      setSavedRoutines(updatedRoutines);
      setSelectedRoutineName(newName);

      // Save to IndexedDB
      await saveRoutines(updatedRoutines);
      await saveSelectedRoutineName(newName);

      setIsRenameRoutineModalOpen(false);
      displayAppMessage('success', `Routine renamed from "${oldName}" to "${newName}"!`);
    } catch (error) {
      console.error('Failed to rename routine:', error);
      displayAppMessage('error', 'Failed to rename routine');

      // Revert state changes on error
      setSelectedRoutineName(oldName);
    }
  };

  const handleStartEditDayName = (dayIndex: number) => {
    setEditingDayIndex(dayIndex);
    setCurrentEditingDayName(days[dayIndex].name);
  };

  const handleSaveDayName = (dayIndex: number) => {
    if (!currentEditingDayName.trim()) {
      displayAppMessage('error', 'Day name cannot be empty.');
      return;
    }

    setDays(prev => prev.map((day, idx) => 
      idx === dayIndex ? { ...day, name: currentEditingDayName.trim() } : day
    ));
    setEditingDayIndex(null);
    setCurrentEditingDayName('');
  };

  const handleCancelEditDayName = () => {
    setEditingDayIndex(null);
    setCurrentEditingDayName('');
  };
  // Exercise and day management
  const addExercise = (dayIndex: number) => {
    setDays(prev => {
      const newDays = [...prev];
      newDays[dayIndex] = {
        ...newDays[dayIndex],
        exercises: [...newDays[dayIndex].exercises, { 
          name: '', 
          sets: 3,
          setType: 'Regular',
          intensityType: 'rir',
          rir: 2,
          rpe: 8,
          percentage: 80
        }]
      };
      return newDays;
    });
  };

  const deleteExercise = (dayIndex: number, exIndex: number) => {
    setDays(prev => {
      const newDays = [...prev];
      newDays[dayIndex] = {
        ...newDays[dayIndex],
        exercises: newDays[dayIndex].exercises.filter((_, idx) => idx !== exIndex)
      };
      return newDays;
    });
  };

  const addDay = () => {
    setDays(prev => [...prev, { name: `Day ${prev.length + 1}`, exercises: [] }]);
  };

  const deleteDay = (dayIndex: number) => {
    if (days.length <= 1) {
      displayAppMessage('error', 'You must have at least one day.');
      return;
    }
    setDays(prev => prev.filter((_, idx) => idx !== dayIndex));
  };
  const updateExercise = (dayIndex: number, exIndex: number, field: keyof WorkoutExercise, value: string | number) => {
    setDays(prev => {
      const newDays = [...prev];
      newDays[dayIndex] = {
        ...newDays[dayIndex],
        exercises: newDays[dayIndex].exercises.map((ex, idx) => 
          idx === exIndex ? { ...ex, [field]: value } : ex
        )
      };
      return newDays;
    });
  };

  const toggleSuperset = (dayIndex: number, exIndex: number) => {
    setDays(prev => {
      const newDays = [...prev];
      const currentExercise = newDays[dayIndex].exercises[exIndex];

      newDays[dayIndex] = {
        ...newDays[dayIndex],
        exercises: newDays[dayIndex].exercises.map((ex, idx) => 
          idx === exIndex ? { ...ex, superset: !currentExercise.superset } : ex
        )
      };
      return newDays;
    });
  };

  // File operations
  const loadJsonFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);

        // Handle backward compatibility - if it's an array of days, wrap it in a week
        if (Array.isArray(parsed)) {
          const validatedDays = parseWorkoutJson(parsed);
          setCycles([{ name: 'Micro Cycle 1', days: validatedDays }]);
          setCurrentCycleIndex(0);
          setJsonSuccess('Workout plan loaded successfully!');
          setJsonError('');
        } else if (parsed.weeks && Array.isArray(parsed.weeks)) {
          // New format with weeks
          const validatedWeeks = parseWorkoutWeeksJson(parsed.weeks);
          setCycles(validatedWeeks);
          setCurrentCycleIndex(0);
          setJsonSuccess('Workout plan loaded successfully!');
          setJsonError('');
        } else {
          setJsonError('Invalid JSON format. Expected an array of days or weeks.');
          setJsonSuccess('');
        }
      } catch (error) {
        setJsonError('Error parsing JSON file. Please check the format.');
        setJsonSuccess('');
      }
    };
    reader.readAsText(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  const parseWorkoutJson = (daysArray: any[]): WorkoutDay[] => {
    return daysArray.map((day, dayIndex) => ({
      name: day.name || `Day ${dayIndex + 1}`,
      exercises: Array.isArray(day.exercises) ? day.exercises.map((ex: any) => ({
        name: ex.name || '',
        sets: Number(ex.sets) || 3,
        setType: ex.setType || 'Regular',
        intensityType: ex.intensityType || 'rir',
        rir: ex.rir ? Number(ex.rir) : (ex.intensityType === 'rir' || !ex.intensityType ? 2 : undefined),
        rpe: ex.rpe ? Number(ex.rpe) : (ex.intensityType === 'rpe' ? 8 : undefined),
        percentage: ex.percentage ? Number(ex.percentage) : (ex.intensityType === 'percentage' ? 80 : undefined),
        superset: ex.superset || false
      })) : []
    }));
  };

  const parseWorkoutWeeksJson = (weeksArray: any[]): WorkoutWeek[] => {
    return weeksArray.map((week, weekIndex) => ({
      name: week.name || `Week ${weekIndex + 1}`,
      days: Array.isArray(week.days) ? parseWorkoutJson(week.days) : []
    }));
  };

  const exportToJson = () => {
    const dataStr = JSON.stringify({ weeks: cycles }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = 'workout-plan.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Computed values
  const cycleVolume = calculateVolume(days.flatMap((day) => day.exercises), allExercises);

  const radarData: RadarDataPoint[] = useMemo(() => MUSCLE_GROUPS.map(muscle => ({
    subject: muscle,
    A: cycleVolume[muscle] || 0, 
    B: WORKOUT_VOLUME_DATA[muscle]?.maximumAdaptiveVolume.min || 0, 
    fullMark: WORKOUT_VOLUME_DATA[muscle]?.maximumRecoverableVolume.max || 25, 
  })), [cycleVolume]);

  const exerciseOptionsForSelect: CategoryOption[] = useMemo(() => {
    const categoryMap: Record<string, Exercise[]> = {};

    allExercises.forEach(exercise => {
      const category = exercise.category || 'Uncategorized';
      if (!categoryMap[category]) {
        categoryMap[category] = [];
      }
      categoryMap[category].push(exercise);
    });

    return Object.entries(categoryMap).map(([name, exercises]) => ({
      name,
      exercises: exercises.sort((a, b) => a.name.localeCompare(b.name))
    }));
  }, [allExercises]);

  // Drag and drop handlers for exercises
  const handleExerciseDragStart = (dayIndex: number, exerciseIndex: number) => {
    setDraggedExercise({ dayIndex, exerciseIndex });
  };
  const handleExerciseDragOver = (dayIndex: number, exerciseIndex: number) => (e: React.DragEvent) => {
    e.preventDefault();
    setExerciseDragOver({ dayIndex, exerciseIndex });
  };
  const handleExerciseDrop = (targetDayIndex: number, targetExerciseIndex: number) => {
    setExerciseDragOver(null);
    if (!draggedExercise) return;

    const { dayIndex: sourceDayIndex, exerciseIndex: sourceExerciseIndex } = draggedExercise;

    // Prevent no-op drop (dropping at own index or immediately after in same day)
    if (
      sourceDayIndex === targetDayIndex &&
      (targetExerciseIndex === sourceExerciseIndex || targetExerciseIndex === sourceExerciseIndex + 1)
    ) {
      setDraggedExercise(null);
      return;
    }

    setDays(prev => {
      const newDays = [...prev];
      // Get the exercise being moved
      const exerciseToMove = newDays[sourceDayIndex].exercises[sourceExerciseIndex];
      // Remove from source
      newDays[sourceDayIndex] = {
        ...newDays[sourceDayIndex],
        exercises: newDays[sourceDayIndex].exercises.filter((_, idx) => idx !== sourceExerciseIndex)
      };
      // Calculate target index considering removal from source
      let adjustedTargetIndex = targetExerciseIndex;
      if (sourceDayIndex === targetDayIndex && sourceExerciseIndex < targetExerciseIndex) {
        adjustedTargetIndex--;
      }
      // Insert at target
      const targetExercises = [...newDays[targetDayIndex].exercises];
      targetExercises.splice(adjustedTargetIndex, 0, exerciseToMove);
      newDays[targetDayIndex] = {
        ...newDays[targetDayIndex],
        exercises: targetExercises
      };
      return newDays;
    });
    setDraggedExercise(null);
  };
  const handleExerciseDragEnd = () => {
    setDraggedExercise(null);
    setExerciseDragOver(null);
  };  // Drag and drop handlers for days
  const handleDayDragStart = (dayIndex: number) => {
    setDraggedDay(dayIndex);
  };
    const handleDayDragOver = (dayIndex: number) => (e: React.DragEvent) => {
    e.preventDefault();
    console.log('🎯 Day drag over:', dayIndex);
    setDayDragOver(dayIndex);
  };    const handleDayDrop = (targetDayIndex: number) => {
    console.log('📍 Day drop at:', targetDayIndex, 'from:', draggedDay);
    setDayDragOver(null);
    if (draggedDay === null) {
      console.log('❌ No dragged day, aborting');
      setDraggedDay(null);
      return;
    }
    // Prevent no-op drop (dropping at own index or immediately after)
    if (
      targetDayIndex === draggedDay ||
      targetDayIndex === draggedDay + 1
    ) {
      console.log('❌ No-op drop prevented');
      setDraggedDay(null);
      return;
    }
    console.log('✅ Performing day reorder');
    setDays(prev => {
      const newDays = [...prev];
      const dayToMove = newDays[draggedDay];
      console.log('Moving day:', dayToMove.name, 'from index', draggedDay, 'to', targetDayIndex);
      // Remove from source
      newDays.splice(draggedDay, 1);
      // Calculate target index considering removal from source
      let adjustedTargetIndex = targetDayIndex;
      if (draggedDay < targetDayIndex) {
        adjustedTargetIndex = targetDayIndex - 1;
      }
      // Clamp to valid range (for dropping at end)
      if (adjustedTargetIndex < 0) adjustedTargetIndex = 0;
      if (adjustedTargetIndex > newDays.length) adjustedTargetIndex = newDays.length;
      console.log('Adjusted target index:', adjustedTargetIndex);
      // Insert at target
      newDays.splice(adjustedTargetIndex, 0, dayToMove);
      console.log('New day order:', newDays.map(d => d.name));
      return newDays;
    });
    setDraggedDay(null);
  };

  const handleDayDragEnd = () => {
    setDraggedDay(null);
    setDayDragOver(null);
  };

  if (currentView === 'exercises') {
    return (
      <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'dark' : ''}`}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 text-foreground font-sans">
          <div className="container mx-auto p-2 sm:p-4 md:p-6 lg:p-8">
            {/* Navigation */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <Button 
                onClick={() => setCurrentView('tracker')} 
                variant="outline"
                className="flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Back to Tracker
              </Button>
              <Button
                onClick={() => setDarkMode(!darkMode)}
                variant="outline"
                size="icon"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>

            <AppMessageDisplay message={appMessage} onClearMessage={clearAppMessage} />

            <ExercisesListPage 
              allExercises={allExercises}
              setAllExercises={setAllExercises}
              displayAppMessage={displayAppMessage}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 text-foreground font-sans">
        <div className="container mx-auto p-2 sm:p-4 md:p-6 lg:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Workout Volume Tracker
              </h1>
              <p className="text-muted-foreground mt-1">Track your weekly training volume by muscle group</p>
            </div>            <div className="flex gap-2">
              <Button
                onClick={() => setCurrentView('exercises')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Library className="w-4 h-4" />
                Exercises
              </Button>
              <Button
                onClick={() => setIsMuscleStressTimelineOpen(true)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                Stress Timeline
              </Button>
              <Button
                onClick={() => setShowWeeklySummarySidebar(!showWeeklySummarySidebar)}
                variant="outline"
                size="icon"
                className="md:hidden"
              >
                {showWeeklySummarySidebar ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
              </Button>
              <Button
                onClick={() => setDarkMode(!darkMode)}
                variant="outline"
                size="icon"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <AppMessageDisplay message={appMessage} onClearMessage={clearAppMessage} />

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-6">            {/* Main workout area */}
            <div className="flex-1 space-y-6">
              {/* Micro Cycle Management */}
              <MicroCycleManagement
                cycles={cycles}
                currentCycleIndex={currentCycleIndex}
                setCurrentCycleIndex={setCurrentCycleIndex}
                onAddCycle={addCycle}
                onDeleteCycle={deleteCycle}
                onCopyCycle={copyCycle}
              />

              {/* Routine Management */}
              <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-800/20 dark:to-indigo-800/20 border-blue-500/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Save className="w-5 h-5 text-blue-500" />
                    Routine Management
                  </CardTitle>
                </CardHeader>                <CardContent className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button onClick={handleSaveCurrentRoutine} className="flex-1 sm:flex-none">
                      <Save className="w-4 h-4 mr-2" />
                      {selectedRoutineName ? `Update "${selectedRoutineName}"` : 'Save Current'}
                    </Button>
                    <Button 
                      onClick={handleCreateNewRoutine} 
                      variant="outline" 
                      className="flex-1 sm:flex-none"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Routine
                    </Button>
                    <div className="flex flex-col flex-1 gap-1">
                      <Select value={selectedRoutineName} onValueChange={setSelectedRoutineName}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select a saved routine" />
                        </SelectTrigger>
                        <SelectContent>
                          {savedRoutines.map(routine => (
                            <SelectItem key={routine.name} value={routine.name}>
                              {routine.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>                      {selectedRoutineName && (
                        <div className="text-xs text-muted-foreground px-2">
                          <span className="inline-flex items-center gap-1">
                            {isLoadingRoutine ? (
                              <>
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                Loading routine...
                              </>
                            ) : (
                              <>
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                Routine loaded automatically
                              </>
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      onClick={handleDeleteSelectedRoutine}
                      disabled={!selectedRoutineName}
                      variant="destructive"
                      className="flex-1 sm:flex-none"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Routine
                    </Button>
                    <Button 
                      onClick={openRenameRoutineModal}
                      disabled={!selectedRoutineName}
                      variant="outline"
                      className="flex-1 sm:flex-none"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Rename Routine
                    </Button>
                    <Button
                      onClick={() => setIsResetDialogOpen(true)}
                      variant="outline"
                      className="flex-1 sm:flex-none border-red-400 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Reset to Default
                    </Button>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="file"
                      accept=".json"
                      onChange={loadJsonFile}
                      ref={fileInputRef}
                      className="hidden"
                    />
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="flex-1 sm:flex-none"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Import JSON
                    </Button>
                    <Button onClick={exportToJson} variant="outline" className="flex-1 sm:flex-none">
                      <Download className="w-4 h-4 mr-2" />
                      Export JSON
                    </Button>
                  </div>
                  {(jsonError || jsonSuccess) && (
                    <div className={`p-2 rounded ${jsonError ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'}`}>
                      {jsonError || jsonSuccess}
                    </div>
                  )}
                </CardContent>
              </Card>              {/* Workout Days - Replaced with tabbed interface */}
              <Tabs
                defaultValue={`day-0`}
                value={`day-${selectedDayTab}`}
                onValueChange={(value: string) => {
                  const idx = parseInt(value.split('-')[1], 10);
                  if (!isNaN(idx)) setSelectedDayTab(idx);
                }}
                className="w-full"
              >
                <TabsList className="flex flex-wrap gap-2 mb-4">
                  <div className="w-full mb-2 text-xs text-muted-foreground">
                    💡 Tip: Drag the grip icon (⋮⋮) to reorder days
                  </div>                  {days.map((day, dayIndex) => {
                    return (<React.Fragment key={dayIndex}>
                        <div className={`relative group flex items-center ${
                          draggedDay === dayIndex ? 'opacity-50 ring-2 ring-blue-500' : ''
                        } ${
                          draggedDay !== null && dayDragOver === dayIndex && draggedDay !== dayIndex ? 'bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-400' : ''
                        } transition-all rounded`}>
                          {/* Drag handle */}
                          <div
                            draggable
                            onDragStart={(e) => {
                              e.stopPropagation();
                              console.log('🚀 Day drag start:', dayIndex);
                              handleDayDragStart(dayIndex);
                            }}
                            onDragEnd={handleDayDragEnd}
                            className="cursor-grab active:cursor-grabbing p-2 rounded-l hover:bg-muted/50 flex items-center"
                            title="Drag to reorder day"
                          >
                            <GripVertical className="w-3 h-3 opacity-40 group-hover:opacity-70 transition-opacity" />
                          </div>                          {/* Tab trigger */}
                          <TabsTrigger 
                            value={`day-${dayIndex}`}
                          >
                            <span>{day.name}</span>
                          </TabsTrigger>
                          {/* Drop zone overlay for the entire area */}
                          <div
                            className="absolute inset-0"
                            style={{ 
                              pointerEvents: draggedDay !== null && draggedDay !== dayIndex ? 'auto' : 'none',
                              zIndex: 10
                            }}
                            onDragOver={handleDayDragOver(dayIndex)}
                            onDrop={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDayDrop(dayIndex);
                            }}
                          />
                        </div>
                      </React.Fragment>
                    );
                  })}
                  {/* Drop zone & preview at the end of the list */}
                  <div
                    onDragOver={handleDayDragOver(days.length)}                    onDrop={(e) => { e.preventDefault(); handleDayDrop(days.length); }}
                    className="flex items-center"
                  >
                  </div><Button onClick={addDay} size="sm" variant="outline" className="ml-2">
                    <Plus className="w-4 h-4 mr-1" /> Add New Day
                  </Button>
                </TabsList>
                {days.map((day, dayIndex) => (
                  <TabsContent key={dayIndex} value={`day-${dayIndex}`}> 
                    <Card className="shadow-lg border-l-4 border-l-blue-500">
                      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <div className="flex items-center gap-2 flex-1">
                            {editingDayIndex === dayIndex ? (
                              <div className="flex items-center gap-2 flex-1">
                                <Input
                                  value={currentEditingDayName}
                                  onChange={(e) => setCurrentEditingDayName(e.target.value)}
                                  className="flex-1 min-w-0"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveDayName(dayIndex);
                                    if (e.key === 'Escape') handleCancelEditDayName();
                                  }}
                                />
                                <Button onClick={() => handleSaveDayName(dayIndex)} size="icon" variant="ghost">
                                  <Check className="w-4 h-4 text-green-600" />
                                </Button>
                                <Button onClick={handleCancelEditDayName} size="icon" variant="ghost">
                                  <X className="w-4 h-4 text-red-600" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 flex-1">
                                <Dumbbell className="w-5 h-5 text-blue-500" />
                                <CardTitle className="text-lg sm:text-xl">{day.name}</CardTitle>
                                <Button onClick={() => handleStartEditDayName(dayIndex)} size="icon" variant="ghost">
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </div>                      <div className="flex gap-2">
                            <Button onClick={() => addExercise(dayIndex)} size="sm">
                              <Plus className="w-4 h-4 mr-1" />
                              Add Exercise
                            </Button>
                            <Button 
                              onClick={() => copyDay(dayIndex)} 
                              size="sm" 
                              variant="outline"
                            >
                              <Copy className="w-4 h-4 mr-1" />
                              Copy Day
                            </Button>
                            <Button 
                              onClick={() => deleteDay(dayIndex)} 
                              size="sm" 
                              variant="destructive"
                              disabled={days.length <= 1}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>                      <CardContent className="p-3 sm:p-6">
                        {day.exercises.length === 0 ? (
                          <p className="text-muted-foreground text-center py-4">No exercises added yet.</p>
                        ) : (
                          <div className="space-y-0">                            {day.exercises.map((exercise, exIndex) => {
                              const isSupersetWithNext = exercise.superset && exIndex < day.exercises.length - 1;
                              const isPrevSuperset = exIndex > 0 && day.exercises[exIndex - 1].superset;
                              const isLastExercise = exIndex === day.exercises.length - 1;
                              const needsMarginAfter = !isSupersetWithNext && !isLastExercise;
                              const rowMargin = needsMarginAfter ? 'mb-6' : 'mb-0';
                              const borderRadius = isSupersetWithNext ? 'rounded-t-lg rounded-b-none' : isPrevSuperset ? 'rounded-t-none rounded-b-lg' : 'rounded-lg';
                              return (<React.Fragment key={exIndex}>
                                  <div
                                    className={`flex flex-col sm:flex-row gap-2 p-3 bg-muted/30 relative ${rowMargin} ${borderRadius} ${
                                      draggedExercise?.dayIndex === dayIndex && draggedExercise?.exerciseIndex === exIndex
                                        ? 'opacity-50 ring-2 ring-blue-500'
                                        : ''
                                    } hover:bg-muted/40 transition-all cursor-grab active:cursor-grabbing`}
                                    draggable
                                    onDragStart={() => handleExerciseDragStart(dayIndex, exIndex)}
                                    onDragOver={handleExerciseDragOver(dayIndex, exIndex)}
                                    onDrop={(e) => {
                                      e.preventDefault();
                                      handleExerciseDrop(dayIndex, exIndex);
                                    }}
                                    onDragEnd={handleExerciseDragEnd}
                                  >
                                    <div className="flex items-center gap-2 flex-1 flex-nowrap min-w-0">                                      <div className="flex flex-col gap-1">
                                        <Button 
                                          size="icon"
                                          variant="ghost"
                                          className="w-6 h-6 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors"
                                          title="Drag to reorder exercise"
                                          tabIndex={-1}
                                        >
                                          <GripVertical className="w-4 h-4" />
                                        </Button>
                                      </div>
                                      <div className="flex items-center gap-1 flex-nowrap min-w-0 flex-1">
                                        <SearchableSelect
                                          value={exercise.name}
                                          onValueChange={(value) => updateExercise(dayIndex, exIndex, 'name', value)}
                                          options={exerciseOptionsForSelect}
                                          placeholder="Select exercise"
                                          className="flex-1 min-w-0"
                                        />                        {/* Muscle icon with tooltip (hover/click) */}
                        {(() => {
                          const ex = allExercises.find(e => e.name === exercise.name);
                          if (!ex) return null;
                          return (
                                            <SimpleTooltip
                                              content={
                                                <div className="flex flex-wrap gap-2 items-center">
                                                  {Object.entries(ex.muscles).map(([muscle, contribution]) => {
                                                    // Calculate magnitude based on SFR and sets
                                                    const magnitude = ex.stimulusFatigue ? Math.min(1.0, (ex.stimulusFatigue / 2.0)) : 0.5;
                                                    return (
                                                      <div key={muscle} className="flex items-center gap-1.5">
                                                        <MuscleGroupIcon 
                                                          muscle={muscle as MuscleGroup} 
                                                          size={20} 
                                                          contribution={contribution}
                                                          magnitude={magnitude}
                                                          style="outlined"
                                                          showTooltip={false}
                                                        />
                                                        <div className="flex flex-col">
                                                          <span className="text-xs font-medium">{muscle}</span>
                                                          <span className="text-[10px] text-muted-foreground">
                                                            {(contribution * exercise.sets).toFixed(1)} sets
                                                            {ex.stimulusFatigue && ` • SFR: ${ex.stimulusFatigue}`}
                                                          </span>
                                                        </div>
                                                      </div>
                                                    );
                                                  })}
                                                </div>
                                              }
                                              clickable
                                            >
                                              <Button variant="ghost" size="icon" className="p-1 text-blue-500" tabIndex={0} aria-label="Show muscles worked">
                                                <Dumbbell className="w-4 h-4" />
                                              </Button>
                                            </SimpleTooltip>
                                          );
                                        })()}
                                      </div>
                                      {/* SFR badge for mobile/compact view */}
                                      <div className="flex sm:hidden items-center ml-1">
                                        {(() => {
                                          const ex = allExercises.find(e => e.name === exercise.name);
                                          if (!ex || ex.stimulusFatigue == null) return null;
                                          return (
                                            <span className="text-xs px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-200 ml-1" title="Stimulus/Fatigue Ratio">
                                              SFR: {ex.stimulusFatigue}
                                            </span>
                                          );
                                        })()}
                                      </div>
                                    </div>

                                    <div className="flex flex-col gap-2 min-w-0">
                                      {/* Mobile: Stack all inputs vertically, Desktop: Two rows */}
                                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                        {/* Sets and Set Type */}
                                        <div className="flex items-center gap-2">
                                          <div className="flex items-center gap-1">
                                            <Input
                                              type="number"
                                              min="1"
                                              value={exercise.sets}
                                              onChange={(e) => updateExercise(dayIndex, exIndex, 'sets', parseInt(e.target.value) || 1)}
                                              className="w-16 text-sm"
                                              placeholder="Sets"
                                            />
                                            <span className="text-xs text-muted-foreground whitespace-nowrap">sets</span>
                                          </div>

                                          <Select 
                                            value={exercise.setType || 'Regular'} 
                                            onValueChange={(value) => updateExercise(dayIndex, exIndex, 'setType', value)}
                                          >
                                            <SelectTrigger className="w-24 sm:w-32 text-sm">
                                              <SelectValue placeholder="Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {SET_TYPES.map(type => (
                                                <SelectItem key={type} value={type}>{type}</SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>

                                        {/* Intensity Type Selection and Input */}
                                        <div className="flex items-center gap-2">
                                          <Select 
                                            value={exercise.intensityType || 'rir'} 
                                            onValueChange={(value) => {
                                              updateExercise(dayIndex, exIndex, 'intensityType', value);
                                              // Set default values when switching intensity types
                                              if (value === 'rir' && !exercise.rir) {
                                                updateExercise(dayIndex, exIndex, 'rir', 2);
                                              } else if (value === 'rpe' && !exercise.rpe) {
                                                updateExercise(dayIndex, exIndex, 'rpe', 8);
                                              } else if (value === 'percentage' && !exercise.percentage) {
                                                updateExercise(dayIndex, exIndex, 'percentage', 80);
                                              }
                                            }}
                                          >
                                            <SelectTrigger className="w-16 sm:w-20 text-sm">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="rir">RIR</SelectItem>
                                              <SelectItem value="rpe">RPE</SelectItem>
                                              <SelectItem value="percentage">%</SelectItem>
                                              <SelectItem value="flow">🌊</SelectItem>
                                            </SelectContent>
                                          </Select>

                                          {/* Conditional Input based on selected type */}
                                          {exercise.intensityType === 'rir' && (
                                            <div className="flex items-center gap-0.5">
                                              <Input
                                                type="number"
                                                min="0"
                                                max="10"
                                                value={exercise.rir ?? 2}
                                                onChange={(e) => updateExercise(dayIndex, exIndex, 'rir', e.target.value ? parseInt(e.target.value) : 2)}
                                                className="w-14 sm:w-16 text-xs sm:text-sm"
                                                placeholder="2"
                                                title="Reps in Reserve (0-10)"
                                              />
                                              <span className="text-[10px] sm:text-xs text-muted-foreground">RIR</span>
                                            </div>
                                          )}

                                          {exercise.intensityType === 'rpe' && (
                                            <div className="flex items-center gap-0.5">
                                              <Input
                                                type="number"
                                                min="1"
                                                max="10"
                                                value={exercise.rpe ?? 8}
                                                onChange={(e) => updateExercise(dayIndex, exIndex, 'rpe', e.target.value ? parseInt(e.target.value) : 8)}
                                                className="w-14 sm:w-16 text-xs sm:text-sm"
                                                placeholder="8"
                                                title="Rate of Perceived Exertion (1-10)"
                                              />
                                              <span className="text-[10px] sm:text-xs text-muted-foreground">RPE</span>
                                            </div>
                                          )}

                                          {exercise.intensityType === 'percentage' && (
                                            <div className="flex items-center gap-0.5">
                                              <Input
                                                type="number"
                                                min="1"
                                                max="100"
                                                value={exercise.percentage ?? 80}
                                                onChange={(e) => updateExercise(dayIndex, exIndex, 'percentage', e.target.value ? parseInt(e.target.value) : 80)}
                                                className="w-14 sm:w-16 text-xs sm:text-sm"
                                                placeholder="80"
                                                title="Percentage of 1RM (1-100%)"
                                              />
                                              <span className="text-[10px] sm:text-xs text-muted-foreground">%</span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                      <div className="flex items-center gap-1">
                                      {/* Copy exercise button */}
                                      <Button 
                                        onClick={() => copyExercise(dayIndex, exIndex)}
                                        size="icon"
                                        variant="ghost"
                                        className="text-muted-foreground hover:text-foreground"
                                        title="Copy exercise"
                                      >
                                        <Copy className="w-4 h-4" />
                                      </Button>

                                      {/* Superset toggle button */}
                                      <Button 
                                        onClick={() => toggleSuperset(dayIndex, exIndex)}
                                        size="icon"
                                        variant="ghost"
                                        className={`w-8 h-8 ${exercise.superset ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950' : 'text-muted-foreground'}`}
                                        title={exercise.superset ? 'Remove from superset' : 'Add to superset with next exercise'}
                                        disabled={exIndex === day.exercises.length - 1}
                                      >
                                        <Link className="w-4 h-4" />
                                      </Button>

                                      <Button 
                                        onClick={() => deleteExercise(dayIndex, exIndex)}
                                        size="icon"
                                        variant="ghost"
                                        className="text-destructive hover:text-destructive-foreground hover:bg-destructive/10"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  {/* Superset connector - show if current exercise is supersetted */}
                                  {isSupersetWithNext && (
                                    <div className="flex flex-col items-center -mt-2 -mb-2 z-10">
                                      <div className="w-1 h-6 bg-blue-300 dark:bg-blue-900/80" style={{ borderRadius: '4px' }} />
                                      <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-950/50 rounded-full border border-blue-200 dark:border-blue-800 shadow-md">
                                        <Link className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                                        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Superset</span>
                                        <Link className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                                      </div>
                                      <div className="w-1 h-6 bg-blue-300 dark:bg-blue-900/80" style={{ borderRadius: '4px' }} />
                                    </div>
                                  )}
                                </React.Fragment>
                              );
                            })}                            {/* If dragging over the end of the list, show preview at the end */}
                            {(() => {
                              const isSelf = draggedExercise && draggedExercise.dayIndex === dayIndex && draggedExercise.exerciseIndex === day.exercises.length;
                              const showPreview = exerciseDragOver && exerciseDragOver.dayIndex === dayIndex && exerciseDragOver.exerciseIndex === day.exercises.length && draggedExercise !== null && !isSelf;
                              return null;
                            })()}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>              {/* Muscle summary at the end of the routine builder */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                    Muscle Group Summary (Current Day)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {(() => {
                      // Use selectedDayTab to get the correct day
                      const dayExercises = days[selectedDayTab]?.exercises || [];
                      const dayVolume = calculateVolume(dayExercises, allExercises);

                      return MUSCLE_GROUPS.map(muscle => {
                        const volume = dayVolume[muscle] || 0;
                        const maxPossibleVolume = Math.max(...Object.values(dayVolume), 10); // Use max volume or minimum of 10
                        const contribution = Math.min(1.0, volume / maxPossibleVolume); // Normalize to 0-1 based on relative volume

                        return (
                          <MuscleGroupIcon 
                            key={muscle}
                            muscle={muscle} 
                            size={20} 
                            contribution={contribution > 0 ? Math.max(0.1, contribution) : 0.1}
                            style="outlined"
                            showTooltip={true}
                          />
                        );
                      });
                    })()}
                  </div>{/* Daily Stress Chart */}
                  {days[selectedDayTab] && (
                    <DailyStressChart
                      key={`stress-chart-${selectedDayTab}`}
                      day={days[selectedDayTab]}
                      allExercises={allExercises}
                      dayIndex={selectedDayTab}
                      allDays={days}
                    />
                  )}
                </CardContent>
              </Card>
            </div>            {/* Weekly Summary Sidebar */}
            {showWeeklySummarySidebar && (
              <WeeklySummarySidebar
                weeklyVolume={cycleVolume}
                muscleGroups={MUSCLE_GROUPS}
                volumeRecommendations={WORKOUT_VOLUME_DATA}
                darkMode={darkMode}
                allExercises={allExercises}
                days={days}
              />
            )}
          </div>
        </div>        {/* Save Routine Modal */}
        <Dialog open={isSaveRoutineModalOpen} onOpenChange={setIsSaveRoutineModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Current Routine</DialogTitle>
              <DialogDescription>
                Enter a name for your current workout routine.
              </DialogDescription>
            </DialogHeader>
            <Input
              placeholder="Routine name"
              value={newRoutineNameInput}
              onChange={(e) => setNewRoutineNameInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleConfirmSaveRoutine();
              }}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleConfirmSaveRoutine}>
                <Save className="w-4 h-4 mr-2" />
                Save Routine
              </Button>            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Rename Routine Modal */}
        <Dialog open={isRenameRoutineModalOpen} onOpenChange={setIsRenameRoutineModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rename Routine</DialogTitle>
              <DialogDescription>
                Enter a new name for "{selectedRoutineName}".
              </DialogDescription>
            </DialogHeader>
            <Input
              placeholder="New routine name"
              value={renameRoutineInput}
              onChange={(e) => setRenameRoutineInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleConfirmRenameRoutine();
              }}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleConfirmRenameRoutine}>
                <Edit3 className="w-4 h-4 mr-2" />
                Rename Routine
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Muscle Stress Timeline Dialog */}
        <MuscleStressTimeline
          isOpen={isMuscleStressTimelineOpen}
          onClose={() => setIsMuscleStressTimelineOpen(false)}
          allExercises={allExercises}
          days={days}
        />

        {/* Reset to Default Confirmation Dialog */}
        <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reset to Default?</DialogTitle>
              <DialogDescription>
                This will erase all your saved routines and exercises and restore the default set. This action cannot be undone. Are you sure?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>              <Button
                variant="destructive"
                onClick={async () => {
                  try {
                    await clearAllData();
                    setAllExercises(DEFAULT_EXERCISES);
                    setSavedRoutines([]);
                    setCycles(DEFAULT_CYCLES);
                    setCurrentCycleIndex(0);
                    setIsResetDialogOpen(false);
                    displayAppMessage('success', 'Reset to default successful!');
                  } catch (error) {
                    console.error('Failed to reset data:', error);
                    displayAppMessage('error', 'Failed to reset data');
                  }
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Yes, Reset
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
