import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectGroup,
  SelectLabel
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import type { Exercise, CategoryOption, MuscleGroup } from '@/types';
import { muscleColors } from '@/constants';
import { MuscleGroupIcon } from '@/components/ui/MuscleGroupIcon';

interface SearchableSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: CategoryOption[];
  placeholder: string;
  className?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({ 
  value, 
  onValueChange, 
  options, 
  placeholder, 
  className 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    
    return options.map(category => ({
      ...category,
      exercises: category.exercises.filter(exercise =>
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(category => category.exercises.length > 0);
  }, [searchTerm, options]);
  
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div className="relative w-full">
      <Select 
        value={value} 
        onValueChange={(val) => {
          onValueChange(val);
          setIsOpen(false);
          setSearchTerm('');
        }} 
        open={isOpen} 
        onOpenChange={setIsOpen}
      >
        <SelectTrigger className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="max-h-[400px]">
          <div className="p-2 sticky top-0 bg-background z-10 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                ref={inputRef}
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 text-sm"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                onKeyUp={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <div className="max-h-[calc(400px-50px)] overflow-y-auto">
            {filteredOptions.length > 0 ? filteredOptions.map(category => (
              <SelectGroup key={category.name}>
                <SelectLabel className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider sticky top-0 bg-background/95 backdrop-blur-sm z-[5]">
                  {category.name}
                </SelectLabel>
                {category.exercises.map(exercise => (
                  <SelectItem key={exercise.name} value={exercise.name} className="cursor-pointer text-sm py-2">                    <div className="flex items-center justify-between w-full">
                      <span>{exercise.name}</span>
                      <div className="flex gap-1 ml-2">                        {Object.entries(exercise.muscles).slice(0, 3).map(([muscle, contribution]) => (
                          <MuscleGroupIcon
                            key={muscle}
                            muscle={muscle as MuscleGroup}
                            size={16}
                            contribution={contribution}
                            style="outlined"
                            showTooltip={true}
                          />
                        ))}
                        {Object.keys(exercise.muscles).length > 3 && (
                          <span className="text-xs text-muted-foreground">+{Object.keys(exercise.muscles).length - 3}</span>
                        )}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            )) : (
              <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                {searchTerm ? `No exercises found for "${searchTerm}".` : "No exercises match."}
              </div>
            )}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
};