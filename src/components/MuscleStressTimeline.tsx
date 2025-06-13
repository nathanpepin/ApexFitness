import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { muscleColors, MUSCLE_GROUPS } from '@/constants';
import type { Exercise, WorkoutDay, MuscleGroup } from '@/types';
import { MuscleGroupIcon } from '@/components/ui/MuscleGroupIcon';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface MuscleStressTimelineProps {
  isOpen: boolean;
  onClose: () => void;
  allExercises: Exercise[];
  days: WorkoutDay[];
}

interface MuscleDefinition {
  name: string;
  recovery: string;
  decayRate: number;
  displayName: string;
}

const muscleDefinitions: MuscleDefinition[] = [
  { name: "Chest", recovery: "Moderate", decayRate: 0.40, displayName: "Chest" }, 
  { name: "Front Delts", recovery: "Moderate", decayRate: 0.40, displayName: "Front Delts" },
  { name: "Side Delts", recovery: "Fast", decayRate: 0.60, displayName: "Side Delts" }, 
  { name: "Rear Delts", recovery: "Fast", decayRate: 0.60, displayName: "Rear Delts" },
  { name: "Triceps", recovery: "Fast", decayRate: 0.55, displayName: "Triceps" }, 
  { name: "Biceps", recovery: "Fast", decayRate: 0.55, displayName: "Biceps" },
  { name: "Forearms", recovery: "Fast", decayRate: 0.65, displayName: "Forearms" }, 
  { name: "Upper Back", recovery: "Moderate", decayRate: 0.35, displayName: "Upper Back" },
  { name: "Lower Back", recovery: "Slow", decayRate: 0.20, displayName: "Lower Back" }, 
  { name: "Traps", recovery: "Moderate", decayRate: 0.45, displayName: "Traps" },
  { name: "Quads", recovery: "Slow", decayRate: 0.25, displayName: "Quads" }, 
  { name: "Hamstrings", recovery: "Slow", decayRate: 0.25, displayName: "Hamstrings" },
  { name: "Glutes", recovery: "Slow", decayRate: 0.25, displayName: "Glutes" },
  { name: "Calves", recovery: "Fast", decayRate: 0.65, displayName: "Calves" }, 
  { name: "Core", recovery: "Moderate", decayRate: 0.50, displayName: "Core" }
];

export const MuscleStressTimeline: React.FC<MuscleStressTimelineProps> = ({
  isOpen,
  onClose,
  allExercises,
  days,
}) => {
  const [toggledMuscles, setToggledMuscles] = useState<Record<string, boolean>>({});
  const [numberOfCycles, setNumberOfCycles] = useState<number>(1);
  const [useFeltSets, setUseFeltSets] = useState<boolean>(true);
  const [isCumulativeMode, setIsCumulativeMode] = useState<boolean>(false); // New state for cumulative view
  const chartRef = useRef<ChartJS>(null);
  const microCycleLength = Math.max(7, days.length);

  const totalDaysToPlot = useMemo(() => numberOfCycles * microCycleLength, [numberOfCycles, microCycleLength]);

  const getMusclesWithExercises = useCallback(() => {
    console.log('🔍 getMusclesWithExercises called');
    console.log('📊 Days:', days.length, 'days');
    console.log('🏋️ All exercises:', allExercises.length, 'exercises');
    
    const currentMusclesWithExercises = new Set<string>();
    days.forEach((day, dayIndex) => {
      console.log(`📅 Day ${dayIndex} (${day.name}):`, day.exercises.length, 'exercises');
      day.exercises.forEach(exercisePerformed => {
        console.log(`  🏃 Looking for: "${exercisePerformed.name}" (length: ${exercisePerformed.name.length})`);
        
        // Debug: log all available exercise names for comparison
        if (dayIndex === 0 && allExercises.length > 0) {
          console.log('📋 Available exercise names (first 5):');
          allExercises.slice(0, 5).forEach((ex, i) => {
            console.log(`    ${i}: "${ex.name}" (length: ${ex.name.length})`);
          });
        }
        
        // Enhanced exercise finding with fallbacks
        let exerciseInfo = allExercises.find(e => e.name === exercisePerformed.name);
        
        // Fallback 1: Case-insensitive search
        if (!exerciseInfo) {
          exerciseInfo = allExercises.find(e => 
            e.name.toLowerCase() === exercisePerformed.name.toLowerCase()
          );
          if (exerciseInfo) {
            console.log(`⚠️ Found exercise via case-insensitive match: "${exercisePerformed.name}" -> "${exerciseInfo.name}"`);
          }
        }
        
        // Fallback 2: Trim whitespace and try again
        if (!exerciseInfo) {
          exerciseInfo = allExercises.find(e => 
            e.name.trim().toLowerCase() === exercisePerformed.name.trim().toLowerCase()
          );
          if (exerciseInfo) {
            console.log(`⚠️ Found exercise after trimming: "${exercisePerformed.name}" -> "${exerciseInfo.name}"`);
          }
        }
        
        console.log(`  ✅ Found: ${exerciseInfo ? 'YES' : 'NO'}`);
        
        if (exerciseInfo && exerciseInfo.muscles) {
          console.log('  💪 Muscles:', Object.keys(exerciseInfo.muscles));
          Object.keys(exerciseInfo.muscles).forEach(muscle => {
            if (muscleDefinitions.find(m => m.name === muscle)) {
              currentMusclesWithExercises.add(muscle);
              console.log(`    ➕ Added muscle: ${muscle}`);
            }
          });
        }
      });
    });
    console.log('🎯 Final muscles with exercises:', Array.from(currentMusclesWithExercises));
    return currentMusclesWithExercises;
  }, [allExercises, days]); // muscleDefinitions is stable

  const musclesWithExercises = useMemo(() => getMusclesWithExercises(), [getMusclesWithExercises]);

  useEffect(() => {
    const initialToggles: Record<string, boolean> = {};
    MUSCLE_GROUPS.forEach(muscleName => {
      if (musclesWithExercises.has(muscleName)) {
        // Preserve existing toggle state if muscle still exists, otherwise default to true
        initialToggles[muscleName] = toggledMuscles[muscleName] !== undefined ? toggledMuscles[muscleName] : true;
      }
    });
    setToggledMuscles(initialToggles);
  }, [musclesWithExercises]); // Only re-init when musclesWithExercises set changes


  const handleToggleMuscle = (muscleName: string) => {
    setToggledMuscles(prev => ({
      ...prev,
      [muscleName]: !prev[muscleName],
    }));
  };

  const sortedMuscleDefinitions = useMemo(() => {
    return MUSCLE_GROUPS
      .map(muscleName => muscleDefinitions.find(mDef => mDef.name === muscleName))
      .filter(Boolean) as MuscleDefinition[];
  }, []); // muscleDefinitions is constant

  const muscleToggleList = useMemo(() => {
    return sortedMuscleDefinitions.filter(mDef => musclesWithExercises.has(mDef.name));
  }, [sortedMuscleDefinitions, musclesWithExercises]);

  const musclesToPlot = useMemo(() => {
    return muscleToggleList
      .filter(mDef => toggledMuscles[mDef.name])
      .map(mDef => mDef.name);
  }, [muscleToggleList, toggledMuscles]);


  const calculateDailyStimulus = useCallback(() => {
    console.log('🔍 MuscleStressTimeline - calculateDailyStimulus called');
    console.log('📊 Days data:', days);
    console.log('🏋️ All exercises count:', allExercises.length);
    console.log('🎯 Sample exercises:', allExercises.slice(0, 3));
    
    const dailyNewStimulusLookup: Record<string, number[]> = {};
    
    muscleDefinitions.forEach(mDef => {
      dailyNewStimulusLookup[mDef.name] = Array(days.length).fill(0);
    });

    days.forEach((day, dayIndex) => {
      console.log(`📅 Processing day ${dayIndex}:`, day.name, 'with', day.exercises.length, 'exercises');      day.exercises.forEach(exercisePerformed => {
        console.log('🏃 Looking for exercise:', exercisePerformed.name);
        
        // Enhanced exercise finding with fallbacks
        let exerciseInfo = allExercises.find(e => e.name === exercisePerformed.name);
        
        // Fallback 1: Case-insensitive search
        if (!exerciseInfo) {
          exerciseInfo = allExercises.find(e => 
            e.name.toLowerCase() === exercisePerformed.name.toLowerCase()
          );
          if (exerciseInfo) {
            console.log(`⚠️ Found exercise via case-insensitive match: "${exercisePerformed.name}" -> "${exerciseInfo.name}"`);
          }
        }
        
        // Fallback 2: Trim whitespace and try again
        if (!exerciseInfo) {
          exerciseInfo = allExercises.find(e => 
            e.name.trim().toLowerCase() === exercisePerformed.name.trim().toLowerCase()
          );
          if (exerciseInfo) {
            console.log(`⚠️ Found exercise after trimming: "${exercisePerformed.name}" -> "${exerciseInfo.name}"`);
          }
        }
        
        console.log('✅ Found exercise info:', exerciseInfo ? 'YES' : 'NO', exerciseInfo?.name);
        if (exerciseInfo && exerciseInfo.muscles) {
          for (const muscleName in exerciseInfo.muscles) {
            if (dailyNewStimulusLookup[muscleName]) {
              const factor = exerciseInfo.muscles[muscleName];
              let sets = exercisePerformed.sets;
              
              if (useFeltSets && exerciseInfo.stimulusFatigue) {
                sets = Math.round(sets * exerciseInfo.stimulusFatigue);
              }
              
              const stimulus = sets * factor;
              dailyNewStimulusLookup[muscleName][dayIndex] += stimulus;
            }
          }
        }
      });
    });

    return dailyNewStimulusLookup;
  }, [allExercises, days, useFeltSets]); // muscleDefinitions is stable

  const getSfrCoverage = useCallback(() => {
    let totalExercises = 0;
    let exercisesWithSfr = 0;
    
    days.forEach(day => {
      day.exercises.forEach(exercisePerformed => {
        const exerciseInfo = allExercises.find(e => e.name === exercisePerformed.name);
        if (exerciseInfo) {
          totalExercises++;
          if (exerciseInfo.stimulusFatigue) {
            exercisesWithSfr++;
          }
        }
      });
    });
    
    return { totalExercises, exercisesWithSfr };
  }, [allExercises, days]);


  const generateChartData = () => {
    const dailyStimulus = calculateDailyStimulus();
    // totalDaysToPlot is already memoized and available in this scope

    const labels = Array.from({ length: totalDaysToPlot }, (_, i) => {
      const dayNumber = (i % microCycleLength) + 1;
      const cycleNumber = Math.floor(i / microCycleLength) + 1;
      return numberOfCycles > 1 ? `C${cycleNumber} D${dayNumber}` : `Day ${dayNumber}`;
    });

    const datasets: any[] = [];

    // First, calculate all individual timelines for selected muscles
    const individualTimelines: Record<string, { definition: MuscleDefinition, timeline: number[] }> = {};
    musclesToPlot.forEach(muscleName => {
      const muscleDef = muscleDefinitions.find(m => m.name === muscleName);
      if (!muscleDef) return;

      const timeline: number[] = [];
      let carriedStress = 0;
      for (let day = 0; day < totalDaysToPlot; day++) {
        if (day > 0) {
          carriedStress = (timeline[day - 1] || 0) * (1 - muscleDef.decayRate);
        } else {
          carriedStress = 0;
        }
        const dayInCycle = day % microCycleLength;
        const newStimulusToday = dayInCycle < days.length ? (dailyStimulus[muscleName]?.[dayInCycle] || 0) : 0;
        const totalStressToday = carriedStress + newStimulusToday;
        timeline.push(totalStressToday < 0.01 ? 0 : totalStressToday);
      }
      individualTimelines[muscleName] = { definition: muscleDef, timeline };
    });

    if (isCumulativeMode && musclesToPlot.length > 0) {
      const cumulativeData = Array(totalDaysToPlot).fill(0);
      musclesToPlot.forEach(muscleName => {
        const data = individualTimelines[muscleName];
        if (data) {
          for (let i = 0; i < totalDaysToPlot; i++) {
            cumulativeData[i] += data.timeline[i];
          }
        }
      });
      datasets.push({
        type: 'line' as const,
        label: `Cumulative Stress (${musclesToPlot.length} muscle${musclesToPlot.length === 1 ? '' : 's'})`,
        data: cumulativeData,
        borderColor: 'rgba(255, 99, 132, 1)', // Distinct color for cumulative
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.1,
        fill: false,
        pointRadius: totalDaysToPlot > 50 ? 1 : 2,
        pointHoverRadius: totalDaysToPlot > 50 ? 3 : 4,
        borderWidth: totalDaysToPlot > 50 ? 1.5 : 2,
        order: 0, // Ensure it's prominent if other lines were ever shown with it
      });
    } else { // Individual mode or no muscles to plot
      Object.values(individualTimelines).forEach(({ definition, timeline }, index) => {
        datasets.push({
          type: 'line' as const,
          label: `${definition.displayName} Stress`,
          data: timeline,
          borderColor: muscleColors[definition.name] || `hsl(${(index * 137.5) % 360}, 65%, 50%)`,
          backgroundColor: `${muscleColors[definition.name] || `hsl(${(index * 137.5) % 360}, 65%, 50%)`}15`,
          tension: 0.1,
          fill: false,
          pointRadius: totalDaysToPlot > 50 ? 1 : 2,
          pointHoverRadius: totalDaysToPlot > 50 ? 3 : 4,
          borderWidth: totalDaysToPlot > 50 ? 1.5 : 2,
          order: index + 1,
        });
      });
    }

    return { labels, datasets };
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Stress Level (Arbitrary Units)',
        },
      },
      x: {
        title: {
          display: true,
          text: `Timeline (${numberOfCycles} Micro Cycle${numberOfCycles > 1 ? 's' : ''})`,
        },
        ticks: {
          autoSkip: true,
          // Corrected: Access totalDaysToPlot from the outer scope where it's defined
          maxTicksLimit: totalDaysToPlot > 30 ? Math.min(Math.floor(totalDaysToPlot / 2), 30) : totalDaysToPlot,
        },
      },
    },
    plugins: {
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          title: function(tooltipItems: any[]) {
            return `${tooltipItems[0].label}`;
          },
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(2);
            }
            return label;
          },
          // afterTitle callback removed as single muscle stacked bar view is removed
        },
      },
      legend: {
        position: 'top' as const,
        display: true,
        labels: {
          maxTicksLimit: 10, // Adjusted for potentially many lines
          usePointStyle: true,
          padding: 8, // Adjusted
          font: {
            size: 10 // Adjusted
          }
        }
      },
    },
  };
  
  const sfrCoverage = useMemo(() => getSfrCoverage(), [getSfrCoverage]);
  const chartData = useMemo(() => generateChartData(), [musclesToPlot, numberOfCycles, microCycleLength, calculateDailyStimulus, useFeltSets, isCumulativeMode, totalDaysToPlot]); // Added isCumulativeMode and totalDaysToPlot

  const singleSelectedMuscleThruToggle = !isCumulativeMode && musclesToPlot.length === 1 ? musclesToPlot[0] as MuscleGroup : undefined;

  // Define muscle groups for helper buttons
  const torsoMuscles: MuscleGroup[] = ["Chest", "Traps", "Upper Back", "Lower Back", "Core"];
  const limbMuscles: MuscleGroup[] = ["Front Delts", "Side Delts", "Rear Delts", "Biceps", "Triceps", "Forearms"];
  const legMuscles: MuscleGroup[] = ["Glutes", "Quads", "Hamstrings", "Calves"];

  const handleSelectPreset = (musclesToSelect: MuscleGroup[] | 'all' | 'none') => {
    const newToggles: Record<string, boolean> = {};
    muscleToggleList.forEach(mDef => {
      if (musclesToSelect === 'all') {
        newToggles[mDef.name] = true;
      } else if (musclesToSelect === 'none') {
        newToggles[mDef.name] = false;
      } else {
        newToggles[mDef.name] = (musclesToSelect as MuscleGroup[]).includes(mDef.name as MuscleGroup);
      }
    });
    setToggledMuscles(newToggles);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isCumulativeMode && musclesToPlot.length > 0 ? (
              <div className="w-5 h-5 rounded bg-gradient-to-r from-purple-500 to-pink-500" />
            ) : singleSelectedMuscleThruToggle ? (
              <MuscleGroupIcon 
                muscle={singleSelectedMuscleThruToggle} 
                size={20} 
                contribution={1.0}
                magnitude={0.8}
                style="outlined"
                showTooltip={false}
              />
            ) : (
              <div className="w-5 h-5 rounded bg-gradient-to-r from-blue-500 to-purple-500" />
            )}
            {isCumulativeMode && musclesToPlot.length > 0 ? `Cumulative Stress (${musclesToPlot.length} muscle${musclesToPlot.length === 1 ? '' : 's'})` : 'Muscle Stress & Recovery Timeline'}
          </DialogTitle>
          <DialogDescription>
            Visualize how training stress accumulates and decays over time for different muscle groups.
            {useFeltSets && (
              <Badge variant="secondary" className="ml-2">
                Using Felt Sets (SFR Applied)
              </Badge>
            )}
            {useFeltSets && sfrCoverage.exercisesWithSfr < sfrCoverage.totalExercises && (
              <Badge variant="outline" className="ml-2 text-yellow-600">
                SFR Coverage: {sfrCoverage.exercisesWithSfr}/{sfrCoverage.totalExercises} exercises
              </Badge>
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Controls: Number of cycles, felt sets toggle, view mode */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-end">
          <div>
            <label htmlFor="numCycles" className="block text-sm font-medium text-muted-foreground mb-1">Number of Micro Cycles</label>
            <Input id="numCycles" type="number" value={numberOfCycles} onChange={(e) => setNumberOfCycles(Math.max(1, parseInt(e.target.value) || 1))} className="w-full" />
          </div>
          <Button onClick={() => setUseFeltSets(!useFeltSets)} variant="outline" className="self-end">
            {useFeltSets ? 'Using Felt Sets (SFR)' : 'Using Actual Sets'}
            {useFeltSets && sfrCoverage.totalExercises > 0 && (
              <span className="ml-1.5 text-xs opacity-70">
                ({sfrCoverage.exercisesWithSfr}/{sfrCoverage.totalExercises} exercises with SFR)
              </span>
            )}
          </Button>
          <Button onClick={() => setIsCumulativeMode(!isCumulativeMode)} variant="outline" className="self-end">
            {isCumulativeMode ? 'Show Individual Lines' : 'Show Cumulative Stress'}
          </Button>
        </div>

        {/* Muscle Toggle Section */}
        {muscleToggleList.length > 0 && (
          <div className="mb-4 p-3 border rounded-md bg-muted/30 space-y-3">
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Quick Select:</h4>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => handleSelectPreset('all')}>Select All</Button>
                <Button size="sm" variant="outline" onClick={() => handleSelectPreset('none')}>Select None</Button>
                <Button size="sm" variant="outline" onClick={() => handleSelectPreset(torsoMuscles)}>Torso</Button>
                <Button size="sm" variant="outline" onClick={() => handleSelectPreset(limbMuscles)}>Limbs</Button>
                <Button size="sm" variant="outline" onClick={() => handleSelectPreset(legMuscles)}>Legs</Button>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Toggle Individual Muscles:</h4>
              <div className="flex flex-wrap gap-2">
                {muscleToggleList.map((mDef) => (
                  <Button
                    key={mDef.name}
                    onClick={() => handleToggleMuscle(mDef.name)}
                    variant={toggledMuscles[mDef.name] ? 'default' : 'outline'}
                    size="sm"
                    className="flex items-center gap-1.5 transition-all duration-150 ease-in-out"
                    style={{
                      // For outline variant, use muscle color for border and text
                      borderColor: !(toggledMuscles[mDef.name]) ? muscleColors[mDef.name] : undefined,
                      color: !(toggledMuscles[mDef.name]) ? muscleColors[mDef.name] : undefined,
                      // For default variant (selected), potentially use muscle color as background
                      // backgroundColor: toggledMuscles[mDef.name] ? muscleColors[mDef.name] : undefined,
                      // color: toggledMuscles[mDef.name] ? 'white' : undefined, // Ensure text contrast if bg changes
                    }}
                  >
                    <MuscleGroupIcon 
                      muscle={mDef.name as MuscleGroup} 
                      size={14} 
                      contribution={1} 
                      style={toggledMuscles[mDef.name] ? "filled" : "outlined"} 
                    />
                    {mDef.displayName}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        <div className="relative h-[50vh] min-h-[300px] sm:min-h-[400px] p-2 border rounded-lg shadow-inner bg-background/30">
          {chartData && chartData.datasets.length > 0 ? (
            <Chart ref={chartRef} type="line" data={chartData} options={chartOptions as any} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              {musclesWithExercises.size === 0 ? "No exercise data found for the current routine." : "Select muscles to display their stress timelines."}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
