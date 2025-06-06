import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, ComposedChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Activity, Clock } from 'lucide-react';
import type { Exercise, WorkoutDay } from '@/types';
import { muscleColors, MUSCLE_GROUPS } from '@/constants';

interface DailyStressChartProps {
  day: WorkoutDay;
  allExercises: Exercise[];
  dayIndex: number;
  allDays: WorkoutDay[]; // All days to calculate accumulated stress
}

interface MuscleDefinition {
  name: string;
  recovery: string;
  decayRate: number;
  displayName: string;
}

// Muscle recovery definitions (same as MuscleStressTimeline)
const muscleDefinitions: MuscleDefinition[] = [
  { name: "Chest", recovery: "Moderate", decayRate: 0.50, displayName: "Chest" },
  { name: "Front Delts", recovery: "Fast", decayRate: 0.60, displayName: "Front Delts" },
  { name: "Side Delts", recovery: "Fast", decayRate: 0.60, displayName: "Side Delts" },
  { name: "Rear Delts", recovery: "Fast", decayRate: 0.65, displayName: "Rear Delts" },
  { name: "Biceps", recovery: "Fast", decayRate: 0.65, displayName: "Biceps" },
  { name: "Triceps", recovery: "Moderate", decayRate: 0.55, displayName: "Triceps" },
  { name: "Quads", recovery: "Slow", decayRate: 0.35, displayName: "Quads" },
  { name: "Hamstrings", recovery: "Slow", decayRate: 0.40, displayName: "Hamstrings" },
  { name: "Glutes", recovery: "Slow", decayRate: 0.40, displayName: "Glutes" },
  { name: "Forearms", recovery: "Very Fast", decayRate: 0.70, displayName: "Forearms" },
  { name: "Calves", recovery: "Fast", decayRate: 0.65, displayName: "Calves" },  { name: "Traps", recovery: "Moderate", decayRate: 0.50, displayName: "Traps" },
  { name: "Lower Back", recovery: "Very Slow", decayRate: 0.25, displayName: "Lower Back" },
  { name: "Core", recovery: "Moderate", decayRate: 0.50, displayName: "Core" },
  { name: "Upper Back", recovery: "Moderate", decayRate: 0.45, displayName: "Upper Back" }
];

export const DailyStressChart: React.FC<DailyStressChartProps> = ({
  day,
  allExercises,
  dayIndex,
  allDays
}) => {
  const [useFeltSets, setUseFeltSets] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'stress' | 'timeline'>('stress');
  const [showStimulusOnly, setShowStimulusOnly] = useState<boolean>(true); // Default to showing only muscles with new stimulus
  
  // Debug effect to ensure component updates when day changes
  useEffect(() => {
    console.log('DailyStressChart updated:', { dayName: day.name, dayIndex, exerciseCount: day.exercises.length });
  }, [day, dayIndex]);
    // Calculate accumulated stress for each muscle group up to this day (including decay)
  const calculateDailyStress = () => {
    const accumulatedStress: Record<string, number> = {};
    
    // Initialize all muscle groups to 0
    MUSCLE_GROUPS.forEach(muscle => {
      accumulatedStress[muscle] = 0;
    });

    // Calculate accumulated stress for all muscles up to and including this day
    MUSCLE_GROUPS.forEach(muscle => {
      const muscleDef = muscleDefinitions.find(m => m.name === muscle);
      if (!muscleDef) return;

      let totalStress = 0;

      // Calculate stress from all days up to and including the current day
      for (let i = 0; i <= dayIndex; i++) {
        const dayData = allDays[i];
        if (!dayData) continue;

        let dayStress = 0;
        dayData.exercises.forEach(exercisePerformed => {
          const exerciseInfo = allExercises.find(e => e.name === exercisePerformed.name);
          if (exerciseInfo && exerciseInfo.muscles && exerciseInfo.muscles[muscle]) {
            const factor = exerciseInfo.muscles[muscle];
            let sets = exercisePerformed.sets;
            
            // Apply SFR if using felt sets and SFR is available
            if (useFeltSets && exerciseInfo.stimulusFatigue) {
              sets = Math.round(sets * exerciseInfo.stimulusFatigue);
            }
            
            dayStress += sets * factor;
          }
        });

        // Apply decay for the time that has passed since this day
        const daysPassedSince = dayIndex - i;
        const decayedStress = dayStress * Math.pow(1 - muscleDef.decayRate, daysPassedSince);
        totalStress += decayedStress;
      }

      accumulatedStress[muscle] = Number(totalStress.toFixed(2));
    });

    return accumulatedStress;
  };

  // Calculate accumulated stress timeline (carried over from previous days + today's stress)
  const calculateStressTimeline = () => {
    const musclesWorkedToday = new Set<string>();
    
    // Find which muscles are worked today
    day.exercises.forEach(exercisePerformed => {
      const exerciseInfo = allExercises.find(e => e.name === exercisePerformed.name);
      if (exerciseInfo && exerciseInfo.muscles) {
        Object.keys(exerciseInfo.muscles).forEach(muscle => {
          if (MUSCLE_GROUPS.includes(muscle as any)) {
            musclesWorkedToday.add(muscle);
          }
        });
      }
    });

    const timelineData: Record<string, {
      carriedOver: number;
      newStress: number;
      totalStress: number;
    }> = {};

    // MODIFIED: Iterate over all MUSCLE_GROUPS to ensure carriedOver stress is calculated for every group.
    MUSCLE_GROUPS.forEach(muscle => {
      const muscleDef = muscleDefinitions.find(m => m.name === muscle);
      if (!muscleDef) {
        // If a muscle group lacks a definition, initialize its stress data to zeros.
        // This ensures all MUSCLE_GROUPS will have an entry in timelineData.
        timelineData[muscle] = { carriedOver: 0, newStress: 0, totalStress: 0 };
        return;
      }

      let accumulatedStress = 0; // Represents carried-over stress from previous days.

      // Calculate accumulated stress from previous days, applying decay.
      for (let i = 0; i < dayIndex; i++) { // Iterate through days before the current day.
        const prevDay = allDays[i];
        if (!prevDay) continue;

        let dayStressForMuscleInPrevDay = 0;
        prevDay.exercises.forEach(exercisePerformed => {
          const exerciseInfo = allExercises.find(e => e.name === exercisePerformed.name);
          if (exerciseInfo && exerciseInfo.muscles && exerciseInfo.muscles[muscle]) {
            const factor = exerciseInfo.muscles[muscle];
            let sets = exercisePerformed.sets;
            
            if (useFeltSets && exerciseInfo.stimulusFatigue) {
              sets = Math.round(sets * exerciseInfo.stimulusFatigue);
            }
            dayStressForMuscleInPrevDay += sets * factor;
          }
        });

        if (dayStressForMuscleInPrevDay > 0) { // Only apply decay if there was stress on that muscle for that day
            const daysPassedSince = dayIndex - i;
            const decayedStress = dayStressForMuscleInPrevDay * Math.pow(1 - muscleDef.decayRate, daysPassedSince);
            accumulatedStress += decayedStress;
        }
      }

      let newStress = 0; // Represents stress added on the current day.
      // MODIFIED: Calculate new stress only if the muscle was worked on the current day.
      if (musclesWorkedToday.has(muscle)) {
          day.exercises.forEach(exercisePerformed => {
            const exerciseInfo = allExercises.find(e => e.name === exercisePerformed.name);
            if (exerciseInfo && exerciseInfo.muscles && exerciseInfo.muscles[muscle]) {
              const factor = exerciseInfo.muscles[muscle];
              let sets = exercisePerformed.sets;
              
              if (useFeltSets && exerciseInfo.stimulusFatigue) {
                sets = Math.round(sets * exerciseInfo.stimulusFatigue);
              }
              newStress += sets * factor;
            }
          });
      }
      
      // Store the calculated stress data for the muscle.
      timelineData[muscle] = {
        carriedOver: Number(accumulatedStress.toFixed(2)),
        newStress: Number(newStress.toFixed(2)),
        totalStress: Number((accumulatedStress + newStress).toFixed(2))
      };
    });

    return timelineData;
  };  const dailyStress = calculateDailyStress();
  const stressTimeline = calculateStressTimeline();
  
  // Prepare data for stress chart - include muscles based on filter
  const chartData = MUSCLE_GROUPS
    .filter(muscle => {
      const timelineInfo = stressTimeline[muscle];
      if (!timelineInfo) return false;

      if (showStimulusOnly) {
        return timelineInfo.newStress > 0;
      } else {
        return timelineInfo.totalStress > 0; // Show if there's any stress (carried over or new)
      }
    })
    .map(muscle => {
      const muscleDef = muscleDefinitions.find(m => m.name === muscle);
      const timelineInfo = stressTimeline[muscle];
      return {
        muscle: muscle,
        stress: Number((timelineInfo?.totalStress || dailyStress[muscle] || 0).toFixed(1)),
        carriedOver: timelineInfo?.carriedOver || 0,
        newStress: timelineInfo?.newStress || 0,
        recovery: muscleDef?.recovery || 'Moderate',
        decayRate: muscleDef?.decayRate || 0.5,
        color: muscleColors[muscle] || '#ccc'
      };
    });
    // Keep MUSCLE_GROUPS order instead of sorting by stress level
  // Prepare data for timeline chart - maintain MUSCLE_GROUPS order initially, then filter
  const timelineChartData = MUSCLE_GROUPS
    .map(muscle => {
      const data = stressTimeline[muscle];
      // Assuming stressTimeline[muscle] is always populated due to previous changes
      // if (!data) return null; // This check might be redundant if all muscles have an entry
      const muscleDef = muscleDefinitions.find(m => m.name === muscle);
      return {
        muscle: muscle.length > 8 ? muscle.substring(0, 8) + '...' : muscle,
        fullMuscle: muscle,
        carriedOver: data.carriedOver,
        newStress: data.newStress,
        totalStress: data.totalStress,
        recovery: muscleDef?.recovery || 'Moderate',
        color: muscleColors[muscle] || '#ccc'
      };
    })
    .filter(item => {
      // item could be null if the map function returned null, but we assume stressTimeline has all entries.
      // However, if muscleDef was not found, some properties might be default.
      // The main filtering is based on stress values.
      if (showStimulusOnly) {
        return item.newStress > 0;
      } else {
        return item.totalStress > 0;
      }
    });

  // Get stress level indicator
  const getStressLevel = (stress: number) => {
    if (stress >= 10) return { level: 'High', color: '#ef4444' };
    if (stress >= 5) return { level: 'Moderate', color: '#f59e0b' };
    if (stress > 0) return { level: 'Low', color: '#10b981' };
    return { level: 'None', color: '#6b7280' };
  };

  const totalStress = chartData.reduce((sum, item) => sum + item.stress, 0);
  const maxStress = Math.max(...chartData.map(item => item.stress), 0);

  if (chartData.length === 0) {
    return (
      <Card className="mt-4">
        <CardHeader className="pb-3">          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="w-4 h-4 text-blue-500" />
            Accumulated Stress Snapshot
          </CardTitle>
        </CardHeader>
        <CardContent>          <div className="flex items-center justify-center h-24 text-muted-foreground">
            <p className="text-sm">All muscles have fully recovered by this day</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-4">      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">            {viewMode === 'stress' ? (
              <Activity className="w-4 h-4 text-blue-500" />
            ) : (
              <Clock className="w-4 h-4 text-blue-500" />
            )}
            {viewMode === 'stress' ? 'Accumulated Stress Snapshot' : 'Stress Timeline'} - {day.name}
          </CardTitle>
          <div className="flex flex-wrap items-center gap-1"> {/* Added flex-wrap and items-center for better responsiveness */}
            <Button
              variant={viewMode === 'stress' ? "default" : "outline"}
              size="sm"
              className="text-xs h-7 px-2"
              onClick={() => setViewMode('stress')}
            >
              Stress
            </Button>
            <Button
              variant={viewMode === 'timeline' ? "default" : "outline"}
              size="sm"
              className="text-xs h-7 px-2"
              onClick={() => setViewMode('timeline')}
            >
              Timeline
            </Button>

            <div className="w-px h-6 bg-border mx-1 self-center" /> {/* Separator */}

            <Button
              variant={showStimulusOnly ? "default" : "outline"}
              size="sm"
              className="text-xs h-7 px-2"
              onClick={() => setShowStimulusOnly(true)}
            >
              Stimulus Today
            </Button>
            <Button
              variant={!showStimulusOnly ? "default" : "outline"}
              size="sm"
              className="text-xs h-7 px-2"
              onClick={() => setShowStimulusOnly(false)}
            >
              All Muscles
            </Button>

            <div className="w-px h-6 bg-border mx-1 self-center" /> {/* Separator */}

            <Button
              variant={useFeltSets ? "outline" : "default"}
              size="sm"
              className="text-xs h-7 px-2"
              onClick={() => setUseFeltSets(false)}
            >
              Sets
            </Button>
            <Button
              variant={useFeltSets ? "default" : "outline"}
              size="sm"
              className="text-xs h-7 px-2"
              onClick={() => setUseFeltSets(true)}
            >
              SFR
            </Button>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          {viewMode === 'stress' ? (
            <>
              Total Stress: <span className="font-semibold">{totalStress.toFixed(1)}</span> • 
              Peak: <span className="font-semibold">{maxStress.toFixed(1)}</span>
            </>
          ) : (
            <>
              Muscles Worked: <span className="font-semibold">{timelineChartData.length}</span> • 
              Max Total Stress: <span className="font-semibold">{Math.max(...timelineChartData.map(d => d.totalStress), 0).toFixed(1)}</span>
            </>
          )}
        </div>
      </CardHeader>      <CardContent>        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {viewMode === 'stress' ? (
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="muscle" 
                  fontSize={10}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={0}
                />
                <YAxis 
                  fontSize={10}
                  width={30}
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload[0]) {
                      const data = payload[0].payload;
                      const stressLevel = getStressLevel(data.stress);
                      return (
                        <div className="bg-background border border-border rounded-lg p-2 shadow-lg">
                          <p className="font-semibold text-sm">{label}</p>
                          <p className="text-xs">
                            Carried Over: <span className="font-semibold text-orange-600">{data.carriedOver}</span>
                          </p>
                          <p className="text-xs">
                            New Stress: <span className="font-semibold text-blue-600">{data.newStress}</span>
                          </p>
                          <p className="text-xs">
                            Total Stress: <span className="font-semibold">{data.stress}</span>
                          </p>
                          <p className="text-xs">
                            Recovery: <span className="font-semibold">{data.recovery}</span>
                          </p>
                          <p className="text-xs">
                            Decay Rate: <span className="font-semibold">{(data.decayRate * 100).toFixed(0)}%/day</span>
                          </p>
                          <p className="text-xs">
                            Level: <span 
                              className="font-semibold" 
                              style={{ color: stressLevel.color }}
                            >
                              {stressLevel.level}
                            </span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="carriedOver" stackId="stress" fill="#f59e0b" name="Carried Over" radius={[0, 0, 2, 2]} />
                <Bar dataKey="newStress" stackId="stress" fill="#3b82f6" name="New Stress" radius={[2, 2, 0, 0]} />
              </ComposedChart>
            ) : (
              <ComposedChart data={timelineChartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="muscle" 
                  fontSize={10}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={0}
                />
                <YAxis 
                  fontSize={10}
                  width={30}
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload[0]) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-background border border-border rounded-lg p-2 shadow-lg">
                          <p className="font-semibold text-sm">{data.fullMuscle}</p>
                          <p className="text-xs">
                            Carried Over: <span className="font-semibold text-orange-600">{data.carriedOver}</span>
                          </p>
                          <p className="text-xs">
                            New Stress: <span className="font-semibold text-blue-600">{data.newStress}</span>
                          </p>
                          <p className="text-xs">
                            Total Stress: <span className="font-semibold">{data.totalStress}</span>
                          </p>
                          <p className="text-xs">
                            Recovery: <span className="font-semibold">{data.recovery}</span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="carriedOver" stackId="stress" fill="#f59e0b" name="Carried Over" />
                <Bar dataKey="newStress" stackId="stress" fill="#3b82f6" name="New Stress" />
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </div>{/* Recovery indicators */}
        <div className="mt-3 flex flex-wrap gap-2">
          {viewMode === 'stress' ? (
            chartData.map(item => {
              const stressLevel = getStressLevel(item.stress);
              return (
                <div 
                  key={item.muscle}
                  className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-muted-foreground/10"
                >
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.muscle}:</span>
                  <span className="font-semibold text-orange-600">{item.carriedOver}</span>
                  <span className="text-muted-foreground">+</span>
                  <span className="font-semibold text-blue-600">{item.newStress}</span>
                  <span className="text-muted-foreground">=</span>
                  <span className="font-semibold">{item.stress}</span>
                  <span className="text-muted-foreground">|</span>
                  <span 
                    className="font-semibold"
                    style={{ color: stressLevel.color }}
                  >
                    {stressLevel.level}
                  </span>
                </div>
              );
            })
          ) : (
            timelineChartData.map(item => (
              <div 
                key={item.fullMuscle}
                className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-muted-foreground/10"
              >
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.fullMuscle}:</span>
                <span className="font-semibold text-orange-600">{item.carriedOver}</span>
                <span className="text-muted-foreground">+</span>
                <span className="font-semibold text-blue-600">{item.newStress}</span>
                <span className="text-muted-foreground">=</span>
                <span className="font-semibold">{item.totalStress}</span>
              </div>
            ))
          )}
        </div>        <div className="mt-3 p-2 bg-muted-foreground/5 rounded text-xs text-muted-foreground">
          {viewMode === 'stress' ? (
            <div>
              <p><strong>Accumulated Stress Breakdown:</strong> Shows total stress levels separated into existing fatigue and newly added stress.</p>
              <div className="flex gap-4 mt-1">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-orange-500 rounded"></div>
                  Carried Over (decayed from previous days)
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded"></div>
                  New Stress (added today)
                </span>
              </div>
            </div>
          ) : (
            <div>
              <p><strong>Stress Timeline:</strong> Shows accumulated fatigue from previous days and new stress added today.</p>
              <div className="flex gap-4 mt-1">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-orange-500 rounded"></div>
                  Carried Over (decayed from previous days)
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded"></div>
                  New Stress (added today)
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
