import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Upload, Trash2 } from 'lucide-react';

interface ImportExportCardProps {
  onImportClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onExportClick: () => void;
  onResetClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  jsonError?: string;
  jsonSuccess?: string;
}

const ImportExportCard: React.FC<ImportExportCardProps> = ({
  onImportClick,
  onExportClick,
  onResetClick,
  fileInputRef,
  jsonError,
  jsonSuccess
}) => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5 text-blue-500" />
          Import/Export
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="file"
            accept=".json"
            onChange={onImportClick}
            ref={fileInputRef}
            className="hidden"
          />
          <Button 
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="flex-1 sm:flex-none"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import JSON
          </Button>
          <Button onClick={onExportClick} variant="outline" className="flex-1 sm:flex-none">
            <Download className="w-4 h-4 mr-2" />
            Export JSON
          </Button>
          <Button
            onClick={onResetClick}
            variant="outline"
            className="flex-1 sm:flex-none border-red-400 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Reset to Default
          </Button>
        </div>
        {(jsonError || jsonSuccess) && (
          <div className={`p-2 rounded ${jsonError ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'}`}>
            {jsonError || jsonSuccess}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImportExportCard;