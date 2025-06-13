import React from 'react';
import { GripVertical, Trash2, Copy, PlusCircle, Check, X, Edit2, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SimpleTooltip } from '@/components/ui/SimpleTooltip';
import { WorkoutExercise, Exercise, CategoryOption, SetType, IntensityType } from '@/types';
import { SET_TYPES } from '@/constants';

interface ExerciseRowProps {
  exercise: WorkoutExercise;
  dayIndex: number;
  exerciseIndex: number;
  allExercises: Exercise[];
  exerciseOptions: CategoryOption[];
  onUpdateExercise: (dayIndex: number, exIndex: number, field: keyof WorkoutExercise, value: string | number | boolean) => void;
  onDeleteExercise: (dayIndex: number, exIndex: number) => void;
  onCopyExercise: (dayIndex: number, exIndex: number) => void;
  onToggleSuperset: (dayIndex: number, exIndex: number) => void;
  isDragging?: boolean;
  dragHandleProps?: any;
  isDragOver?: boolean;
}

const ExerciseRow: React.FC<ExerciseRowProps> = React.memo(({
  exercise,
  dayIndex,
  exerciseIndex,
  allExercises, // For finding exercise details if needed
  exerciseOptions, // For the select dropdown
  onUpdateExercise,
  onDeleteExercise,
  onCopyExercise,
  onToggleSuperset,
  isDragging,
  dragHandleProps,
  isDragOver,
}) => {
  const selectedExerciseInfo = allExercises.find(e => e.name === exercise.name);

  const handleInputChange = (field: keyof WorkoutExercise, value: string) => {
    let processedValue: string | number = value;
    if (field === 'sets' || field === 'rir' || field === 'rpe' || field === 'percentage') {
      processedValue = value === '' ? '' : Number(value);
      if (isNaN(Number(processedValue)) && processedValue !== '') return; // Prevent NaN for number fields
    }
    onUpdateExercise(dayIndex, exerciseIndex, field, processedValue);
  };

  const handleSelectChange = (field: keyof WorkoutExercise, value: string) => {
    onUpdateExercise(dayIndex, exerciseIndex, field, value);
    // If changing intensity type, clear other intensity values
    if (field === 'intensityType') {
      if (value !== 'rir') onUpdateExercise(dayIndex, exerciseIndex, 'rir', '');
      if (value !== 'rpe') onUpdateExercise(dayIndex, exerciseIndex, 'rpe', '');
      if (value !== 'percentage') onUpdateExercise(dayIndex, exerciseIndex, 'percentage', '');
    }
  };

  return (
    <div 
      className={`flex items-stretch gap-2 p-3 rounded-lg border transition-all duration-150 
        ${isDragging ? 'opacity-50 bg-blue-100 dark:bg-blue-900/50 shadow-2xl' : 'bg-gray-50 dark:bg-gray-800'} 
        ${isDragOver ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-200 dark:border-gray-700'}
        ${exercise.superset && !isDragging ? 'ml-4 border-l-4 border-l-purple-500 dark:border-l-purple-400' : ''}
      `}
    >
      <div {...dragHandleProps} className="flex items-center justify-center cursor-grab p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
        <GripVertical className="h-5 w-5" />
      </div>

      {/* Exercise Name Select */}
      <div className="flex-grow min-w-[200px]">
        <Select
          value={exercise.name}
          onValueChange={(value) => handleSelectChange('name', value)}
        >
          <SelectTrigger className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 h-10">
            <SelectValue placeholder="Select exercise" />
          </SelectTrigger>          <SelectContent className="max-h-[400px] bg-white dark:bg-gray-700">
            {exerciseOptions.map(category => (
              <React.Fragment key={category.name}>
                <div className="px-2 py-1.5 text-sm font-semibold text-gray-500 dark:text-gray-400">{category.name}</div>
                {category.exercises.map(ex => (
                  <SelectItem key={ex.name} value={ex.name}>{ex.name}</SelectItem>
                ))}
              </React.Fragment>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sets Input */}
      <div className="w-20">
        <Input 
          type="number" 
          placeholder="Sets"
          value={exercise.sets === undefined ? '' : exercise.sets}
          onChange={(e) => handleInputChange('sets', e.target.value)}
          className="w-full text-center bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 h-10"
          min={1}
        />
      </div>

      {/* Set Type Select */}
      <div className="w-32">
        <Select
          value={exercise.setType}
          onValueChange={(value) => handleSelectChange('setType', value as SetType)}
        >
          <SelectTrigger className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 h-10">
            <SelectValue placeholder="Set Type" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-700">
            {SET_TYPES.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Intensity Type Select */}
      <div className="w-32">
        <Select
          value={exercise.intensityType}
          onValueChange={(value) => handleSelectChange('intensityType', value as IntensityType)}
        >
          <SelectTrigger className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 h-10">
            <SelectValue placeholder="Intensity" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-700">
            <SelectItem value="rir">RIR</SelectItem>
            <SelectItem value="rpe">RPE</SelectItem>
            <SelectItem value="percentage">% 1RM</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Intensity Value Input */}
      <div className="w-20">
        {exercise.intensityType === 'rir' && (
          <Input 
            type="number" 
            placeholder="RIR"
            value={exercise.rir === undefined ? '' : exercise.rir}
            onChange={(e) => handleInputChange('rir', e.target.value)}
            className="w-full text-center bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 h-10"
            min={0} max={5}
          />
        )}
        {exercise.intensityType === 'rpe' && (
          <Input 
            type="number" 
            placeholder="RPE"
            value={exercise.rpe === undefined ? '' : exercise.rpe}
            onChange={(e) => handleInputChange('rpe', e.target.value)}
            className="w-full text-center bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 h-10"
            min={1} max={10} step={0.5}
          />
        )}
        {exercise.intensityType === 'percentage' && (
          <Input 
            type="number" 
            placeholder="%"
            value={exercise.percentage === undefined ? '' : exercise.percentage}
            onChange={(e) => handleInputChange('percentage', e.target.value)}
            className="w-full text-center bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 h-10"
            min={1} max={100}
          />
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-1">
        <SimpleTooltip content={exercise.superset ? "Unlink Superset" : "Mark as Superset"}>
          <Button variant="ghost" size="icon" onClick={() => onToggleSuperset(dayIndex, exerciseIndex)} className={`hover:bg-gray-200 dark:hover:bg-gray-700 ${exercise.superset ? 'text-purple-500 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'}`}>
            <Link2 className="h-4 w-4" />
          </Button>
        </SimpleTooltip>
        <SimpleTooltip content="Copy Exercise">
          <Button variant="ghost" size="icon" onClick={() => onCopyExercise(dayIndex, exerciseIndex)} className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-200 dark:hover:bg-gray-700">
            <Copy className="h-4 w-4" />
          </Button>
        </SimpleTooltip>
        <SimpleTooltip content="Delete Exercise">
          <Button variant="ghost" size="icon" onClick={() => onDeleteExercise(dayIndex, exerciseIndex)} className="text-red-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-200 dark:hover:bg-gray-700">
            <Trash2 className="h-4 w-4" />
          </Button>
        </SimpleTooltip>
      </div>
    </div>
  );
});

export default ExerciseRow;
