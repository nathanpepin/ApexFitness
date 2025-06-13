import React from 'react';
import RoutineManagement from './RoutineManagement';
import ImportExportCard from './ImportExportCard';
import { SavedRoutine } from '@/types';

interface RoutineManagementSectionProps {
  savedRoutines: SavedRoutine[];
  selectedRoutineName: string;
  setSelectedRoutineName: (name: string) => void;
  onSaveCurrentRoutine: () => void;
  onDeleteSelectedRoutine: () => void;
  onOpenRenameModal: () => void;
  isLoadingRoutine: boolean;
  onImportClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onExportClick: () => void;
  onResetClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  jsonError?: string;
  jsonSuccess?: string;
}

const RoutineManagementSection: React.FC<RoutineManagementSectionProps> = ({
  savedRoutines,
  selectedRoutineName,
  setSelectedRoutineName,
  onSaveCurrentRoutine,
  onDeleteSelectedRoutine,
  onOpenRenameModal,
  isLoadingRoutine,
  onImportClick,
  onExportClick,
  onResetClick,
  fileInputRef,
  jsonError,
  jsonSuccess
}) => {
  return (
    <div className="space-y-6">
      {/* Routine Management */}
      <RoutineManagement
        savedRoutines={savedRoutines}
        selectedRoutineName={selectedRoutineName}
        setSelectedRoutineName={setSelectedRoutineName}
        onSaveCurrentRoutine={onSaveCurrentRoutine}
        onDeleteSelectedRoutine={onDeleteSelectedRoutine}
        onOpenRenameModal={onOpenRenameModal}
        isLoadingRoutine={isLoadingRoutine}
      />
      
      {/* Import/Export */}
      <ImportExportCard
        onImportClick={onImportClick}
        onExportClick={onExportClick}
        onResetClick={onResetClick}
        fileInputRef={fileInputRef}
        jsonError={jsonError}
        jsonSuccess={jsonSuccess}
      />
    </div>
  );
};

export default RoutineManagementSection;