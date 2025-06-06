import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MuscleGroupIcon } from '@/components/ui/MuscleGroupIcon';
import type { MuscleGroup, WorkoutVolumeData, Exercise, WorkoutDay } from '@/types';
import { muscleColors } from '@/constants';
import VolumeLandmarksBar from './VolumeLandmarksBar';

interface WeeklySummarySidebarProps {
  weeklyVolume: Record<string, number>;
  muscleGroups: MuscleGroup[];
  volumeRecommendations: Record<MuscleGroup, WorkoutVolumeData>;
  darkMode: boolean;
  allExercises: Exercise[];
  days: WorkoutDay[];
}

export const WeeklySummarySidebar: React.FC<WeeklySummarySidebarProps> = ({ 
  weeklyVolume, 
  muscleGroups, 
  volumeRecommendations, 
  darkMode, 
  allExercises,
  days,
}) => {
  // Compute weighted average SFR for each muscle group for the week
  const muscleGroupSFR: Record<string, number | null> = {};
  muscleGroups.forEach(group => {
    let weightedSfrSum = 0;
    let totalWeight = 0;
    days.forEach(day => {
      day.exercises.forEach(ex => {
        const exercise = allExercises.find(e => e.name === ex.name);
        if (exercise && exercise.muscles[group] && exercise.stimulusFatigue != null) {
          const muscleContribution = exercise.muscles[group];
          const weight = ex.sets * muscleContribution;
          weightedSfrSum += exercise.stimulusFatigue * weight;
          totalWeight += weight;
        }
      });
    });
    muscleGroupSFR[group] = totalWeight > 0 ? +(weightedSfrSum / totalWeight).toFixed(2) : null;
  });

  return (
    <div className="w-full md:w-72 lg:w-80 shrink-0">
      <Card className="sticky top-24 bg-card/80 dark:bg-slate-800/80 backdrop-blur-md shadow-2xl z-20 border dark:border-slate-700">
        <CardHeader className="p-3 sm:p-4 border-b dark:border-slate-700">
          <CardTitle className="text-md sm:text-lg flex items-center gap-2">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            Weekly Quick View
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 sm:p-3 space-y-2 max-h-[calc(100vh-12rem)] overflow-y-auto">
          {muscleGroups.map(group => {
            const volume = weeklyVolume[group] || 0;
            const rec = volumeRecommendations[group];
            if (!rec) return null;
            const avgSFR = muscleGroupSFR[group];
            const feltSets = avgSFR != null ? Math.round(volume * avgSFR) : null;

            // Helper to get the left % for the set counter, centering it on the visual segment
            const getVolumePosition = (
              current: number,
              mevRange: [number, number],
              mavRange: [number, number]
            ) => {
              if (current < mevRange[0]) { // Before MEV starts -> MV segment (1st quarter)
                return 12.5;
              } else if (current >= mevRange[0] && current <= mevRange[1]) { // In MEV range -> MEV segment (2nd quarter)
                return 37.5;
              } else if (current > mevRange[1] && current <= mavRange[1]) { // In MAV range (after MEV, up to MAV end) -> MAV segment (3rd quarter)
                return 62.5;
              } else { // current > mavRange[1] -> MRV segment or above (4th quarter)
                return 87.5;
              }
            };
            const volumePosition = getVolumePosition(
              volume,
              [rec.minimumEffectiveVolume, Math.max(rec.minimumEffectiveVolume, rec.maximumAdaptiveVolume.min - 1)], // mevRange
              [rec.maximumAdaptiveVolume.min, rec.maximumAdaptiveVolume.max]  // mavRange
            );

            // Determine color for the set counter based on volume
            let setCounterBgColor = "bg-slate-700"; // Default/fallback
            let setCounterTextColor = "text-white";
            if (volume < rec.maintenanceVolume) {
              setCounterBgColor = "bg-blue-600"; 
            } else if (volume >= rec.maintenanceVolume && volume < rec.minimumEffectiveVolume) {
              setCounterBgColor = "bg-sky-600"; 
            } else if (volume >= rec.minimumEffectiveVolume && volume <= Math.max(rec.minimumEffectiveVolume, rec.maximumAdaptiveVolume.min - 1)) {
              setCounterBgColor = "bg-emerald-600"; 
            } else if (volume > Math.max(rec.minimumEffectiveVolume, rec.maximumAdaptiveVolume.min - 1) && volume <= rec.maximumAdaptiveVolume.max) {
              setCounterBgColor = "bg-green-600"; 
            } else if (volume > rec.maximumAdaptiveVolume.max && volume <= rec.maximumRecoverableVolume.max) {
              setCounterBgColor = "bg-yellow-500";
              setCounterTextColor = "text-black";
            } else if (volume > rec.maximumRecoverableVolume.max) {
              setCounterBgColor = "bg-red-600";
            }

            return (
              <div key={group} className="flex flex-col mb-2">
                <div className="flex items-center gap-2">
                  {/* Muscle Group Icon */}
                  <div className="flex-shrink-0">
                    <MuscleGroupIcon 
                      muscle={group}
                      size={18}
                      contribution={volume > 0 ? Math.max(0.1, Math.min(1.0, volume / rec.maximumRecoverableVolume.max)) : 0.1}
                      magnitude={volume > 0 ? Math.min(1.0, volume / rec.maximumRecoverableVolume.max) : 0}
                      style="outlined"
                      showTooltip={true}
                    />
                  </div>
                  {/* Muscle group name with fixed width for alignment */}
                  <span className="text-sm font-medium text-foreground w-20 flex-shrink-0 truncate" title={group}>
                    {group}
                  </span>
                  <div className="relative flex-1">
                    <VolumeLandmarksBar
                      currentVolume={volume}
                      mv={rec.maintenanceVolume}
                      mev={[rec.minimumEffectiveVolume, Math.max(rec.minimumEffectiveVolume, rec.maximumAdaptiveVolume.min - 1)]}
                      mav={[rec.maximumAdaptiveVolume.min, rec.maximumAdaptiveVolume.max]}
                      mrv={rec.maximumRecoverableVolume.max}
                      isCompact={true}
                      hideIndicator={true} // <-- Pass the new prop here
                    />
                  </div>
                </div>
                {/* Set counter positioned above the correct section of the bar */}
                <div className="relative h-5 flex items-center" style={{ marginLeft: 'calc(18px + 8px + 80px + 8px)' }}>
                  <div className="absolute left-0 top-0 w-full h-full pointer-events-none">
                    <div
                      className="absolute -top-1.5 transform -translate-x-1/2 z-10"
                      style={{ left: `${volumePosition}%` }}
                    >
                      <span className={`text-xs font-semibold px-1.5 py-0.5 rounded shadow border border-border/50 whitespace-nowrap ${setCounterBgColor} ${setCounterTextColor}`}>
                        {volume.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  {/* SFR and Felt sets aligned to the right */}
                  <div className="flex-1 flex justify-end gap-2 text-xs text-gray-600 dark:text-gray-400">
                    {avgSFR != null && (
                      <span>SFR: {avgSFR.toFixed(1)}</span>
                    )}
                    {feltSets != null && (
                      <span>Felt: {feltSets}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};