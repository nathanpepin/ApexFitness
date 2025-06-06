import React from "react";

interface VolumeLandmarksBarProps {
  currentVolume: number;
  mv?: number; 
  mev?: [number, number]; 
  mav?: [number, number]; 
  mrv?: number; 
  isCompact?: boolean;
  muscleGroupName?: string; // Added to display muscle group name
  muscleGroupColor?: string; // Added for the color dot
  hideIndicator?: boolean; // <-- Add this new prop
}

const DEFAULT_MV = 6;
const DEFAULT_MEV: [number, number] = [7, 12];
const DEFAULT_MAV: [number, number] = [13, 20];
const DEFAULT_MRV = 20;

const getIndicatorPosition = (
  current: number,
  mv: number,
  mev: [number, number],
  mav: [number, number],
  mrv: number,
  isCompact?: boolean
) => {
  const rangeStart = 0; // Volume scale starts at 0
  // Use a consistent maximum range that accommodates most muscle groups
  const rangeEnd = Math.max(mrv + 5, 25); // Ensures consistent positioning with minimum of 25
  
  // Handle case where currentVolume is 0 to prevent division by zero if range is 0
  if (rangeEnd === rangeStart) return 0;
  const clampedCurrent = Math.max(rangeStart, Math.min(current, rangeEnd));
  return ((clampedCurrent - rangeStart) / (rangeEnd - rangeStart)) * 100;
};

const VolumeLandmarksBar: React.FC<VolumeLandmarksBarProps> = ({
  currentVolume,
  mv = DEFAULT_MV,
  mev = DEFAULT_MEV,
  mav = DEFAULT_MAV,
  mrv = DEFAULT_MRV,
  isCompact = false,
  muscleGroupName,
  muscleGroupColor,
  hideIndicator, // <-- Destructure the new prop
}) => {
  const indicatorLeftPercent = getIndicatorPosition(currentVolume, mv, mev, mav, mrv, isCompact);

  let currentVolumeBgColor = "bg-slate-700"; // Default/fallback
  let currentVolumeTextColor = "text-white";

  if (currentVolume < mv) {
    currentVolumeBgColor = "bg-blue-600"; 
  } else if (currentVolume >= mv && currentVolume < mev[0]) {
    currentVolumeBgColor = "bg-sky-600"; 
  } else if (currentVolume >= mev[0] && currentVolume <= mev[1]) {
    currentVolumeBgColor = "bg-emerald-600"; 
  } else if (currentVolume > mev[1] && currentVolume <= mav[1]) {
    currentVolumeBgColor = "bg-green-600"; 
  } else if (currentVolume > mav[1] && currentVolume <= mrv) {
    currentVolumeBgColor = "bg-yellow-500";
    currentVolumeTextColor = "text-black";
  } else if (currentVolume > mrv) {
    currentVolumeBgColor = "bg-red-600";
  }

  if (!isCompact) {
    // Original non-compact rendering (can be further styled if needed)
    return (
      <div className="relative w-full max-w-xl mx-auto mt-6">
        {muscleGroupName && <h4 className="text-sm font-medium mb-1">{muscleGroupName}</h4>} {/* Optional name for non-compact */}
        <div className="flex border rounded overflow-hidden dark:bg-zinc-900 bg-white shadow">
          {/* MV, MEV, MAV, MRV sections */}
          <div className="flex-1 py-4 text-center border-r dark:border-zinc-700">
            <div className="font-semibold">{mv}</div>
            <div className="text-xs text-zinc-500">MV</div>
          </div>
          <div className="flex-1 py-4 text-center border-r dark:border-zinc-700">
            <div className="font-semibold">{mev[0]}-{mev[1]}</div>
            <div className="text-xs text-zinc-500">MEV</div>
          </div>
          <div className="flex-1 py-4 text-center border-r dark:border-zinc-700">
            <div className="font-semibold">{mav[0]}-{mav[1]}</div>
            <div className="text-xs text-zinc-500">MAV</div>
          </div>
          <div className="flex-1 py-4 text-center">
            <div className="font-semibold">{mrv}+</div>
            <div className="text-xs text-zinc-500">MRV</div>
          </div>
        </div>
        <div
          className="absolute -top-7 left-0 w-auto transform -translate-x-1/2"
          style={{ left: `${indicatorLeftPercent}%` }}
        >
          <div className={`flex flex-col items-center`}>
            <div className={`text-xs px-2 py-1 rounded shadow border ${currentVolumeBgColor} ${currentVolumeTextColor} border-transparent`}>
              {currentVolume.toFixed(1)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Compact rendering with inlined muscle group name
  return (
    <div className={`flex items-center w-full mx-auto ${isCompact ? 'mt-1' : 'mt-6'} gap-2`}>
      {isCompact && muscleGroupName && (
        <div className="flex items-center gap-1.5 shrink-0" style={{ width: '80px' /* Adjust width as needed */ }}>
          {muscleGroupColor && (
            <div 
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: muscleGroupColor }}
            />
          )}
          <span className="text-xs font-medium truncate" title={muscleGroupName}>{muscleGroupName}</span>
        </div>
      )}
      <div className={`relative flex-1 ${isCompact ? 'h-6' : ''}`}>
        {/* Landmark Bar segments */}
        <div className="flex h-full rounded overflow-hidden shadow-sm">
          <div className="flex-1 flex items-center justify-center text-white text-[10px] font-medium dark:bg-zinc-700 bg-zinc-400" title={`MV: ${mv}`}><span>{mv}</span></div>
          <div className="flex-1 flex items-center justify-center text-white text-[10px] font-medium dark:bg-sky-700 bg-sky-400" title={`MEV: ${mev[0]}-${mev[1]}`}><span>{mev[0]}-{mev[1]}</span></div>
          <div className="flex-1 flex items-center justify-center text-white text-[10px] font-medium dark:bg-emerald-700 bg-emerald-400" title={`MAV: ${mav[0]}-${mav[1]}`}><span>{mav[0]}-{mav[1]}</span></div>
          <div className="flex-1 flex items-center justify-center text-white text-[10px] font-medium dark:bg-rose-700 bg-rose-400" title={`MRV: ${mrv}+`}><span>{mrv}+</span></div>
        </div>

        {/* Current Volume Indicator (conditionally rendered) */}
        {!hideIndicator && (
          <div
            className="absolute -top-3 left-0 w-auto transform -translate-x-1/2 z-10"
            style={{ left: `${indicatorLeftPercent}%` }}
          >
            <div 
              className={`text-[10px] font-bold px-1 py-0 rounded-sm shadow-md ${currentVolumeBgColor} ${currentVolumeTextColor}`}
            >
              {currentVolume.toFixed(0)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VolumeLandmarksBar;
