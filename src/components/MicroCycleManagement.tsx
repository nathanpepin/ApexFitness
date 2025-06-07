import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2, Copy, ChevronLeft, ChevronRight } from 'lucide-react';
import { SimpleTooltip } from '@/components/ui/SimpleTooltip';
import { WorkoutWeek } from '@/types';

interface MicroCycleManagementProps {
  cycles: WorkoutWeek[];
  currentCycleIndex: number;
  setCurrentCycleIndex: (index: number) => void;
  onAddCycle: () => void;
  onDeleteCycle: (index: number) => void;
  onCopyCycle: (index: number) => void;
}

const MicroCycleManagement: React.FC<MicroCycleManagementProps> = ({
  cycles,
  currentCycleIndex,
  setCurrentCycleIndex,
  onAddCycle,
  onDeleteCycle,
  onCopyCycle,
}) => {
  return (
    <Card className="shadow-lg bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-lg font-semibold text-gray-700 dark:text-gray-200 flex items-center justify-between">
          <span>Micro Cycle Management</span>
          <div className="flex items-center space-x-1">
            <SimpleTooltip content="Add New Micro Cycle">
              <Button variant="ghost" size="icon" onClick={onAddCycle} className="text-green-500 hover:text-green-600 dark:hover:text-green-400">
                <PlusCircle className="h-5 w-5" />
              </Button>
            </SimpleTooltip>
            <SimpleTooltip content="Delete Current Micro Cycle">
              <Button variant="ghost" size="icon" onClick={() => onDeleteCycle(currentCycleIndex)} disabled={cycles.length <= 1} className="text-red-500 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50">
                <Trash2 className="h-5 w-5" />
              </Button>
            </SimpleTooltip>
            <SimpleTooltip content="Copy Current Micro Cycle">
              <Button variant="ghost" size="icon" onClick={() => onCopyCycle(currentCycleIndex)} className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400">
                <Copy className="h-5 w-5" />
              </Button>
            </SimpleTooltip>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2 pb-4">
        <div className="flex items-center justify-center space-x-2">
          <SimpleTooltip content="Previous Micro Cycle">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setCurrentCycleIndex(Math.max(0, currentCycleIndex - 1))} 
              disabled={currentCycleIndex === 0}
              className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </SimpleTooltip>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap">
            {cycles[currentCycleIndex]?.name || 'Micro Cycle'} ({currentCycleIndex + 1} / {cycles.length})
          </span>
          <SimpleTooltip content="Next Micro Cycle">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setCurrentCycleIndex(Math.min(cycles.length - 1, currentCycleIndex + 1))} 
              disabled={currentCycleIndex === cycles.length - 1}
              className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </SimpleTooltip>
        </div>
      </CardContent>
    </Card>
  );
};

export default MicroCycleManagement;
