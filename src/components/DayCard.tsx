import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2, Copy, Edit2, Check, X, GripVertical } from 'lucide-react';
import ExerciseRow from './ExerciseRow';
import { SimpleTooltip } from '@/components/ui/SimpleTooltip';
import {
  WorkoutDay, 
  WorkoutExercise, 
  Exercise, 
  CategoryOption,
} from '@/types';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  Active,
  Over
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface DayCardProps {
  day: WorkoutDay;
  dayIndex: number;
  allExercises: Exercise[];
  exerciseOptions: CategoryOption[];
  onUpdateExercise: (dayIndex: number, exIndex: number, field: keyof WorkoutExercise, value: string | number | boolean) => void;
  onDeleteExercise: (dayIndex: number, exIndex: number) => void;
  onCopyExercise: (dayIndex: number, exIndex: number) => void;
  onAddExercise: (dayIndex: number) => void;
  onDeleteDay: (dayIndex: number) => void;
  onCopyDay: (dayIndex: number) => void;
  onStartEditDayName: (dayIndex: number) => void;
  onSaveDayName: (dayIndex: number) => void;
  onCancelEditDayName: () => void;
  onUpdateDayName: (newName: string) => void; // For inline editing
  isEditingDayName: boolean;
  currentEditingDayName: string;
  onToggleSuperset: (dayIndex: number, exIndex: number) => void;
  onReorderExercises: (dayIndex: number, oldIndex: number, newIndex: number) => void;
  // Drag and drop for the day card itself
  id: string; // for dnd-kit sortable item
  isDayDragging?: boolean;
  dayDragHandleProps?: any;
  isDayDragOver?: boolean;
}

const DayCard: React.FC<DayCardProps> = ({
  day,
  dayIndex,
  allExercises,
  exerciseOptions,
  onUpdateExercise,
  onDeleteExercise,
  onCopyExercise,
  onAddExercise,
  onDeleteDay,
  onCopyDay,
  onStartEditDayName,
  onSaveDayName,
  onCancelEditDayName,
  onUpdateDayName,
  isEditingDayName,
  currentEditingDayName,
  onToggleSuperset,
  onReorderExercises,
  id,
  isDayDragging,
  dayDragHandleProps,
  isDayDragOver
}) => {
  const { 
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isThisDayDragging // Renamed to avoid conflict
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isThisDayDragging ? 0.5 : 1,
    zIndex: isThisDayDragging ? 10 : 1, // Ensure dragging item is on top
  };

  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);

  const exerciseSensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleExerciseDragStart = (event: any) => {
    const { active } = event;
    setActiveExerciseId(active.id as string);
  };

  const handleExerciseDragEnd = (event: any) => {
    setActiveExerciseId(null);
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = day.exercises.findIndex(ex => `ex-${dayIndex}-${ex.name}-${day.exercises.indexOf(ex)}` === active.id);
      const newIndex = day.exercises.findIndex(ex => `ex-${dayIndex}-${ex.name}-${day.exercises.indexOf(ex)}` === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        onReorderExercises(dayIndex, oldIndex, newIndex);
      }
    }
  };
  
  const exerciseIds = day.exercises.map((ex, index) => `ex-${dayIndex}-${ex.name}-${index}`);

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      className={`shadow-xl transition-all duration-150 flex flex-col 
        ${isThisDayDragging ? 'ring-2 ring-blue-500 shadow-2xl' : ''}
        ${isDayDragOver ? 'border-2 border-blue-500' : 'border-gray-200 dark:border-gray-700'}
        bg-white dark:bg-gray-800/80 backdrop-blur-sm`}
    >
      <CardHeader 
        {...attributes} // Spread attributes for sortable item
        className="flex flex-row items-center justify-between p-3 bg-gray-100 dark:bg-gray-700/50 rounded-t-lg border-b border-gray-200 dark:border-gray-600"
      >
        <div {...dayDragHandleProps} {...listeners} className="cursor-grab p-2 mr-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <GripVertical className="h-5 w-5" />
        </div>
        {isEditingDayName ? (
          <div className="flex-grow flex items-center">
            <Input 
              type="text" 
              value={currentEditingDayName}
              onChange={(e) => onUpdateDayName(e.target.value)}
              onBlur={() => onSaveDayName(dayIndex)}
              onKeyDown={(e) => e.key === 'Enter' && onSaveDayName(dayIndex)}
              className="flex-grow h-8 text-base dark:bg-gray-700 dark:text-white"
              autoFocus
            />
            <Button variant="ghost" size="icon" onClick={() => onSaveDayName(dayIndex)} className="ml-1 text-green-500 hover:text-green-600">
              <Check className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onCancelEditDayName} className="text-red-500 hover:text-red-600">
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <CardTitle 
            className="text-md font-semibold text-gray-700 dark:text-gray-200 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 flex-grow"
            onClick={() => onStartEditDayName(dayIndex)}
          >
            {day.name}
          </CardTitle>
        )}
        <div className="flex items-center space-x-1 ml-2">
          <SimpleTooltip content="Add Exercise">
            <Button variant="ghost" size="icon" onClick={() => onAddExercise(dayIndex)} className="text-green-500 hover:text-green-600 dark:hover:text-green-400">
              <PlusCircle className="h-5 w-5" />
            </Button>
          </SimpleTooltip>
          <SimpleTooltip content="Copy Day">
            <Button variant="ghost" size="icon" onClick={() => onCopyDay(dayIndex)} className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400">
              <Copy className="h-5 w-5" />
            </Button>
          </SimpleTooltip>
          <SimpleTooltip content="Delete Day">
            <Button variant="ghost" size="icon" onClick={() => onDeleteDay(dayIndex)} className="text-red-500 hover:text-red-600 dark:hover:text-red-400">
              <Trash2 className="h-5 w-5" />
            </Button>
          </SimpleTooltip>
        </div>
      </CardHeader>
      <CardContent className="p-3 space-y-2 flex-grow min-h-[100px]">
        <DndContext 
          sensors={exerciseSensors} 
          collisionDetection={closestCenter} 
          onDragStart={handleExerciseDragStart}
          onDragEnd={handleExerciseDragEnd}
        >
          <SortableContext items={exerciseIds} strategy={verticalListSortingStrategy}>
            {day.exercises.map((exercise, exIndex) => {
              const exerciseId = `ex-${dayIndex}-${exercise.name}-${exIndex}`;
              return (
                <SortableExerciseRow
                  key={exerciseId}
                  id={exerciseId}
                  exercise={exercise}
                  dayIndex={dayIndex}
                  exerciseIndex={exIndex}
                  allExercises={allExercises}
                  exerciseOptions={exerciseOptions}
                  onUpdateExercise={onUpdateExercise}
                  onDeleteExercise={onDeleteExercise}
                  onCopyExercise={onCopyExercise}
                  onToggleSuperset={onToggleSuperset}
                />
              );
            })}
          </SortableContext>
          <DragOverlay>
            {activeExerciseId && day.exercises.find((ex, idx) => `ex-${dayIndex}-${ex.name}-${idx}` === activeExerciseId) ? (
              <ExerciseRow 
                exercise={day.exercises.find((ex, idx) => `ex-${dayIndex}-${ex.name}-${idx}` === activeExerciseId)!}
                dayIndex={dayIndex} 
                exerciseIndex={day.exercises.findIndex((ex, idx) => `ex-${dayIndex}-${ex.name}-${idx}` === activeExerciseId)!} 
                allExercises={allExercises} 
                exerciseOptions={exerciseOptions} 
                onUpdateExercise={() => {}} // No-op for overlay
                onDeleteExercise={() => {}} // No-op for overlay
                onCopyExercise={() => {}} // No-op for overlay
                onToggleSuperset={() => {}} // No-op for overlay
                isDragging={true}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
        {day.exercises.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No exercises added for this day. Click '+' to add one.</p>
        )}
      </CardContent>
    </Card>
  );
};

// Wrapper for ExerciseRow to make it sortable
const SortableExerciseRow: React.FC<Omit<React.ComponentProps<typeof ExerciseRow>, 'dragHandleProps' | 'isDragging' | 'isDragOver'> & { id: string }> = (props) => {
  const { 
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging 
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <ExerciseRow 
        {...props} 
        dragHandleProps={listeners} 
        isDragging={isDragging} 
      />
    </div>
  );
};

export default DayCard;
