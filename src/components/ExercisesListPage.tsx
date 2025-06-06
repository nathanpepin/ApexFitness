import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Plus, Trash2, Library, Sparkles, X, Edit3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { Exercise, AppMessage, MuscleGroup } from '@/types';
import { MUSCLE_GROUPS, categoryColors, muscleColors } from '@/constants';
import { MuscleGroupIcon } from '@/components/ui/MuscleGroupIcon';

interface ExercisesListPageProps {
  allExercises: Exercise[];
  setAllExercises: (exercises: Exercise[]) => void;
  displayAppMessage: (type: 'success' | 'error', text: string) => void;
}

export const ExercisesListPage: React.FC<ExercisesListPageProps> = ({ 
  allExercises, 
  setAllExercises, 
  displayAppMessage 
}) => {
  const [newExerciseForm, setNewExerciseForm] = useState<{
    name: string;
    category: string;
    muscles: Record<string, number>;
  }>({ name: '', category: '', muscles: {} });
  const [currentMuscleName, setCurrentMuscleName] = useState(MUSCLE_GROUPS[0]);
  const [currentMuscleContribution, setCurrentMuscleContribution] = useState(0.5);
  const [searchTerm, setSearchTerm] = useState('');

  // Editing state for exercises
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; category: string; muscles: Record<string, number> }>({ name: '', category: '', muscles: {} });
  const [editMuscleName, setEditMuscleName] = useState(MUSCLE_GROUPS[0]);
  const [editMuscleContribution, setEditMuscleContribution] = useState(0.5);

  const [activeCategory, setActiveCategory] = useState<string>('');
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const categories = useMemo(() => {
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

  const filteredAndSortedCategories = useMemo(() => {
    if (!searchTerm) return categories;
    return categories.map(category => ({
      ...category,
      exercises: category.exercises.filter(exercise =>
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(category => category.exercises.length > 0);
  }, [categories, searchTerm]);

  // Sidebar search state and filtered categories
  const [sidebarSearch, setSidebarSearch] = useState('');
  const sidebarCategories = useMemo(() => {
    if (!sidebarSearch) return filteredAndSortedCategories;
    const term = sidebarSearch.toLowerCase();
    return filteredAndSortedCategories
      .map(cat => {
        // Filter exercises by name or muscle group
        const filteredExercises = cat.exercises.filter(ex =>
          ex.name.toLowerCase().includes(term) ||
          Object.keys(ex.muscles).some(muscle => muscle.toLowerCase().includes(term))
        );
        return { ...cat, exercises: filteredExercises };
      })
      .filter(cat => cat.exercises.length > 0);
  }, [sidebarSearch, filteredAndSortedCategories]);

  const [lastClickedExercise, setLastClickedExercise] = useState<string | null>(null);

  const handleAddNewExerciseMusclePart = () => {
    if (currentMuscleName && currentMuscleContribution > 0) {
      setNewExerciseForm(prev => ({
        ...prev,
        muscles: {
          ...prev.muscles,
          [currentMuscleName]: currentMuscleContribution
        }
      }));
    }
  };

  const handleSaveNewExercise = () => {
    if (!newExerciseForm.name.trim() || !newExerciseForm.category || Object.keys(newExerciseForm.muscles).length === 0) {
      displayAppMessage('error', 'Please fill in all required fields (name, category, and at least one muscle).');
      return;
    }

    const exerciseExists = allExercises.some(ex => ex.name.toLowerCase() === newExerciseForm.name.toLowerCase());
    if (exerciseExists) {
      displayAppMessage('error', 'An exercise with this name already exists.');
      return;
    }

    const newExercise: Exercise = {
      name: newExerciseForm.name.trim(),
      category: newExerciseForm.category,
      muscles: { ...newExerciseForm.muscles }
    };

    setAllExercises([...allExercises, newExercise]);
    setNewExerciseForm({ name: '', category: '', muscles: {} });
    displayAppMessage('success', `Exercise "${newExercise.name}" added successfully!`);
  };

  const handleDeleteExercise = (exerciseNameToDelete: string) => {
    setAllExercises(allExercises.filter(ex => ex.name !== exerciseNameToDelete));
    displayAppMessage('success', `Exercise "${exerciseNameToDelete}" deleted successfully!`);
  };

  const startEditExercise = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setEditForm({ name: exercise.name, category: exercise.category, muscles: { ...exercise.muscles } });
    setEditMuscleName(MUSCLE_GROUPS[0]);
    setEditMuscleContribution(0.5);
  };

  const handleEditExerciseMusclePart = () => {
    if (editMuscleName && editMuscleContribution > 0) {
      setEditForm(prev => ({
        ...prev,
        muscles: {
          ...prev.muscles,
          [editMuscleName]: editMuscleContribution
        }
      }));
    }
  };

  const handleSaveEditExercise = () => {
    if (!editForm.name.trim() || !editForm.category || Object.keys(editForm.muscles).length === 0) {
      displayAppMessage('error', 'Please fill in all required fields (name, category, and at least one muscle).');
      return;
    }
    // Prevent duplicate name (unless it's the same exercise)
    if (
      allExercises.some(
        ex => ex.name.toLowerCase() === editForm.name.toLowerCase() && ex !== editingExercise
      )
    ) {
      displayAppMessage('error', 'An exercise with this name already exists.');
      return;
    }
    setAllExercises(allExercises.map(ex =>
      ex === editingExercise ? { ...editForm, name: editForm.name.trim() } : ex
    ));
    setEditingExercise(null);
    displayAppMessage('success', `Exercise "${editForm.name}" updated successfully!`);
  };

  const handleCancelEditExercise = () => {
    setEditingExercise(null);
  };

  // Scroll to section on sidebar click
  const handleSidebarClick = (category: string) => {
    const ref = sectionRefs.current[category];
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Scroll to exercise in main list and highlight
  const handleSidebarExerciseClick = (exerciseName: string) => {
    setLastClickedExercise(exerciseName);
    const el = document.getElementById(`exercise-${exerciseName.replace(/[^a-zA-Z0-9]/g, '-')}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Remove highlight when search changes
  useEffect(() => {
    setLastClickedExercise(null);
  }, [sidebarSearch]);

  // Track active category in view (optional, for highlight)
  useEffect(() => {
    const handleScroll = () => {
      let found = '';
      for (const { name } of filteredAndSortedCategories) {
        const ref = sectionRefs.current[name];
        if (ref) {
          const rect = ref.getBoundingClientRect();
          if (rect.top < 120) {
            found = name;
          }
        }
      }
      setActiveCategory(found || (filteredAndSortedCategories[0]?.name ?? ''));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [filteredAndSortedCategories]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 pb-12 min-h-screen">
      {/* Sidebar: sticky on desktop, horizontal scroll on mobile */}
      <aside
        className="lg:sticky lg:top-8 z-30 mb-2 lg:mb-0 lg:mr-2 flex lg:flex-col gap-2 overflow-x-auto px-1 py-2 bg-background/80 rounded-lg shadow-sm border lg:w-48 w-full min-w-[140px]"
        style={{ height: 'fit-content' }}
      >
        {/* Sidebar search bar */}
        <div className="mb-2 flex items-center gap-2 px-1">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={sidebarSearch}
            onChange={e => setSidebarSearch(e.target.value)}
            placeholder="Search exercises or muscles..."
            className="w-full bg-transparent border-none outline-none text-sm px-1 py-1"
            style={{ background: 'none' }}
          />
        </div>
        {sidebarCategories.length > 0 ? sidebarCategories.map(({ name, exercises }) => (
          <div key={name}>
            <button
              onClick={() => handleSidebarClick(name)}
              className={`px-3 py-1 rounded font-medium text-sm whitespace-nowrap transition-colors border-2 w-full text-left ${activeCategory === name ? 'border-primary bg-primary/10 text-primary' : 'border-transparent hover:bg-muted/50'}`}
              style={{ borderLeftWidth: '4px' }}
            >
              {name}
            </button>
            {/* If searching, show matching exercises under category */}
            {sidebarSearch && exercises.length > 0 && (
              <ul className="ml-2 mt-1 space-y-0.5">                {exercises.slice(0, 6).map(ex => {
                  const primaryMuscle = Object.keys(ex.muscles)[0] as MuscleGroup;
                  const primaryContribution = ex.muscles[primaryMuscle] || 0.5;
                  return (
                    <li
                      key={ex.name}
                      className={`text-xs text-muted-foreground truncate flex items-center gap-1 cursor-pointer hover:text-primary rounded px-1 py-0.5 transition-colors ${lastClickedExercise === ex.name ? 'bg-primary/20 text-primary font-semibold' : ''}`}
                      onClick={() => handleSidebarExerciseClick(ex.name)}
                    >                      <MuscleGroupIcon 
                        muscle={primaryMuscle} 
                        size={16} 
                        contribution={primaryContribution}
                        style="outlined"
                        showTooltip={true}
                      />
                    </li>
                  );
                })}
                {exercises.length > 6 && (
                  <li className="text-xs italic text-muted-foreground">+{exercises.length - 6} more</li>
                )}
              </ul>
            )}
          </div>
        )) : (
          <span className="text-xs text-muted-foreground px-2 py-1">No matches found</span>
        )}
      </aside>
      {/* Main content */}
      <div className="flex-1 space-y-6">
        <Card className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 dark:from-violet-800/20 dark:to-purple-800/20 border-violet-500/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600">
              <Library className="w-7 h-7 text-violet-500" />
              Exercise Library
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Manage your exercise database with {allExercises.length} exercises.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search exercises in library..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/70 backdrop-blur-sm"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-dashed border-primary/30 bg-primary/5 dark:bg-primary/10 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2 text-primary">
              <Plus className="w-5 h-5" />
              Add New Exercise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input 
                placeholder="Exercise Name" 
                value={newExerciseForm.name} 
                onChange={(e) => setNewExerciseForm({...newExerciseForm, name: e.target.value})} 
                className="bg-background/70" 
                aria-label="New exercise name"
              />
              <Select 
                value={newExerciseForm.category} 
                onValueChange={(val) => setNewExerciseForm({...newExerciseForm, category: val})}
              >
                <SelectTrigger className="bg-background/70">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(categoryColors).map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Muscle Targeting</h4>
              {Object.keys(newExerciseForm.muscles).length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-background/50 rounded-lg border">                  {Object.entries(newExerciseForm.muscles).map(([muscle, contribution]) => (
                    <Badge 
                      key={muscle} 
                      variant="secondary" 
                      className="flex items-center gap-1.5" 
                      style={{ borderColor: muscleColors[muscle] || '#ccc', borderWidth: '1px' }}
                    >
                      <MuscleGroupIcon 
                        muscle={muscle as MuscleGroup} 
                        size={14} 
                        contribution={contribution}
                        style="outlined"
                      />
                      {muscle}: {contribution}
                      <button 
                        onClick={() => {
                          const newMuscles = { ...newExerciseForm.muscles };
                          delete newMuscles[muscle];
                          setNewExerciseForm({ ...newExerciseForm, muscles: newMuscles });
                        }} 
                        className="ml-1 opacity-50 hover:opacity-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-2">              <Select value={currentMuscleName} onValueChange={(value) => setCurrentMuscleName(value as typeof currentMuscleName)}>
                  <SelectTrigger className="flex-1 bg-background/70">
                    <SelectValue placeholder="Select Muscle"/>
                  </SelectTrigger>
                  <SelectContent>                    {MUSCLE_GROUPS.map(muscle => (
                      <SelectItem key={muscle} value={muscle}>
                        <div className="flex items-center gap-2">
                          <MuscleGroupIcon 
                            muscle={muscle} 
                            size={16} 
                            contribution={1.0}
                            style="outlined"
                          />
                          {muscle}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input 
                  type="number" 
                  step="0.1" 
                  min="0.1" 
                  max="1" 
                  placeholder="Contribution" 
                  value={currentMuscleContribution} 
                  onChange={(e) => setCurrentMuscleContribution(parseFloat(e.target.value) || 0.1)} 
                  className="w-full sm:w-32 bg-background/70" 
                  aria-label="Muscle contribution"
                />
                <Button 
                  onClick={handleAddNewExerciseMusclePart} 
                  variant="outline" 
                  size="sm" 
                  className="w-full sm:w-auto"
                >
                  <Plus className="w-3 h-3 mr-1"/>
                  Add Muscle
                </Button>
              </div>
            </div>
            <Button 
              onClick={handleSaveNewExercise} 
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Create Exercise
            </Button>
          </CardContent>
        </Card>

        {filteredAndSortedCategories.length > 0 ? filteredAndSortedCategories.map(({ name: categoryName, exercises }) => (
          <div
            key={categoryName}
            id={`category-${categoryName}`}
            ref={el => (sectionRefs.current[categoryName] = el)}
          >
            <Card className="overflow-hidden shadow-lg">
              <CardHeader className={`${categoryColors[categoryName as keyof typeof categoryColors]} text-white p-4`}>
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                  <Library className="w-5 h-5" />
                  {categoryName} ({exercises.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {exercises.map((exercise, idx) => (
                  <div 
                    key={exercise.name}
                    id={`exercise-${exercise.name.replace(/[^a-zA-Z0-9]/g, '-')}`}
                    className={`p-3 sm:p-4 ${idx !== 0 ? 'border-t dark:border-slate-700' : ''} hover:bg-muted/50 dark:hover:bg-slate-800/50 transition-colors`}
                  >
                    {editingExercise && editingExercise.name === exercise.name ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Input
                            placeholder="Exercise Name"
                            value={editForm.name}
                            onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                            className="bg-background/70"
                          />
                          <Select
                            value={editForm.category}
                            onValueChange={val => setEditForm(f => ({ ...f, category: val }))}
                          >
                            <SelectTrigger className="bg-background/70">
                              <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(categoryColors).map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-muted-foreground">Muscle Targeting</h4>
                          {Object.keys(editForm.muscles).length > 0 && (
                            <div className="flex flex-wrap gap-2 p-3 bg-background/50 rounded-lg border">                              {Object.entries(editForm.muscles).map(([muscle, contribution]) => (
                                <Badge 
                                  key={muscle} 
                                  variant="secondary" 
                                  className="flex items-center gap-1.5" 
                                  style={{ borderColor: muscleColors[muscle] || '#ccc', borderWidth: '1px' }}
                                >
                                  <MuscleGroupIcon 
                                    muscle={muscle as MuscleGroup} 
                                    size={14} 
                                    contribution={contribution}
                                    style="outlined"
                                  />
                                  {muscle}: {contribution}
                                  <button 
                                    onClick={() => {
                                      const newMuscles = { ...editForm.muscles };
                                      delete newMuscles[muscle];
                                      setEditForm({ ...editForm, muscles: newMuscles });
                                    }} 
                                    className="ml-1 opacity-50 hover:opacity-100"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          )}
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Select value={editMuscleName} onValueChange={v => setEditMuscleName(v as typeof editMuscleName)}>
                              <SelectTrigger className="flex-1 bg-background/70">
                                <SelectValue placeholder="Select Muscle" />
                              </SelectTrigger>
                              <SelectContent>                                {MUSCLE_GROUPS.map(muscle => (
                                  <SelectItem key={muscle} value={muscle}>
                                    <div className="flex items-center gap-2">
                                      <MuscleGroupIcon 
                                        muscle={muscle} 
                                        size={16} 
                                        contribution={1.0}
                                        style="outlined"
                                      />
                                      {muscle}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Input
                              type="number"
                              step="0.1"
                              min="0.1"
                              max="1"
                              placeholder="Contribution"
                              value={editMuscleContribution}
                              onChange={e => setEditMuscleContribution(parseFloat(e.target.value) || 0.1)}
                              className="w-full sm:w-32 bg-background/70"
                            />
                            <Button
                              onClick={handleEditExerciseMusclePart}
                              variant="outline"
                              size="sm"
                              className="w-full sm:w-auto"
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Add Muscle
                            </Button>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button onClick={handleSaveEditExercise} className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                            <Sparkles className="w-4 h-4 mr-2" />
                            Save Changes
                          </Button>
                          <Button onClick={handleCancelEditExercise} variant="outline">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3">
                        <div className="flex-grow">
                          <h4 className="font-semibold text-md sm:text-lg text-foreground">{exercise.name}</h4>
                          <div className="mt-1.5 flex flex-wrap gap-1.5">                            {Object.entries(exercise.muscles).map(([muscle, contribution]) => (
                              <MuscleGroupIcon 
                                key={muscle}
                                muscle={muscle as MuscleGroup} 
                                size={16} 
                                contribution={contribution}
                                style="outlined"
                                showTooltip={true}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2 items-center mt-2 sm:mt-0 shrink-0 self-start sm:self-center">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteExercise(exercise.name)} 
                            className="text-destructive hover:text-destructive-foreground hover:bg-destructive/10 w-8 h-8"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => startEditExercise(exercise)}
                            className="w-8 h-8"
                            title="Edit Exercise"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )) : (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No exercises found{searchTerm && ` for "${searchTerm}"`}. Try a different search or add new exercises!
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};