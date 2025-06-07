import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, FolderOpen, Trash2, Edit3, RotateCcw, Loader2 } from 'lucide-react';
import { SimpleTooltip } from '@/components/ui/SimpleTooltip';
import { SavedRoutine } from '@/types';

interface RoutineManagementProps {
  savedRoutines: SavedRoutine[];
  selectedRoutineName: string;
  setSelectedRoutineName: (name: string) => void;
  onSaveCurrentRoutine: () => void;
  onDeleteSelectedRoutine: () => void;
  onOpenRenameModal: () => void;
  isLoadingRoutine: boolean;
}

const RoutineManagement: React.FC<RoutineManagementProps> = ({
  savedRoutines,
  selectedRoutineName,
  setSelectedRoutineName,
  onSaveCurrentRoutine,
  onDeleteSelectedRoutine,
  onOpenRenameModal,
  isLoadingRoutine,
}) => {
  return (
    <Card className="shadow-lg bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-lg font-semibold text-gray-700 dark:text-gray-200 flex items-center justify-between">
          <span>Routine Management</span>
          {isLoadingRoutine && <Loader2 className="h-5 w-5 animate-spin text-blue-500" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2 pb-4 space-y-3">
        <div className="flex items-center space-x-2">
          <Select value={selectedRoutineName} onValueChange={setSelectedRoutineName} disabled={isLoadingRoutine}>
            <SelectTrigger className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
              <SelectValue placeholder="Select a routine..." />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-700">
              {savedRoutines.length === 0 && (
                <SelectItem value="" disabled>No saved routines</SelectItem>
              )}
              {savedRoutines.map(routine => (
                <SelectItem key={routine.name} value={routine.name}>
                  {routine.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <SimpleTooltip content={selectedRoutineName ? "Update Selected Routine" : "Save as New Routine"}>
            <Button 
              onClick={onSaveCurrentRoutine} 
              variant={selectedRoutineName ? "outline" : "default"}
              className={`w-full ${selectedRoutineName ? 'border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/50' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
              disabled={isLoadingRoutine}
            >
              {selectedRoutineName ? <RotateCcw className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
              {selectedRoutineName ? 'Update' : 'Save New'}
            </Button>
          </SimpleTooltip>

          <SimpleTooltip content="Rename Selected Routine">
            <Button 
              onClick={onOpenRenameModal} 
              variant="outline" 
              className="w-full border-yellow-500 text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/50"
              disabled={!selectedRoutineName || isLoadingRoutine}
            >
              <Edit3 className="mr-2 h-4 w-4" />
              Rename
            </Button>
          </SimpleTooltip>
        </div>
        <SimpleTooltip content="Delete Selected Routine">
          <Button 
            onClick={onDeleteSelectedRoutine} 
            variant="destructive_outline"
            className="w-full"
            disabled={!selectedRoutineName || isLoadingRoutine}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Selected Routine
          </Button>
        </SimpleTooltip>
      </CardContent>
    </Card>
  );
};

export default RoutineManagement;
