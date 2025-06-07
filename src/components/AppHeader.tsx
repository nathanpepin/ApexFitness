import React from 'react';
import { Moon, Sun, Menu, X, BarChart3, Dumbbell, Settings, Info, Save, FolderOpen, Trash2, Edit3, PlusCircle, Copy, ChevronsLeft, ChevronsRight, RotateCcw, FileDown, FileUp, Maximize, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SimpleTooltip } from '@/components/ui/SimpleTooltip';
import { ViewType } from '@/types';

interface AppHeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  showMobileMenu: boolean;
  setShowMobileMenu: (show: boolean) => void;
  onExport: () => void;
  onImportClick: () => void;
  onResetData: () => void;
  onToggleSidebar: () => void;
  isSidebarVisible: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  darkMode,
  toggleDarkMode,
  currentView,
  setCurrentView,
  showMobileMenu,
  setShowMobileMenu,
  onExport,
  onImportClick,
  onResetData,
  onToggleSidebar,
  isSidebarVisible,
}) => {
  const navItems = [
    { view: 'tracker' as ViewType, label: 'Workout Tracker', icon: Dumbbell },
    { view: 'analytics' as ViewType, label: 'Progress Analytics', icon: BarChart3 },
    { view: 'exercises' as ViewType, label: 'Exercise Database', icon: Settings },
    { view: 'guide' as ViewType, label: 'User Guide', icon: Info },
  ];

  return (
    <header className="bg-gray-800 dark:bg-gray-900 text-white p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <SimpleTooltip content={isSidebarVisible ? "Hide Weekly Summary" : "Show Weekly Summary"}>
            <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="mr-2 text-white hover:bg-gray-700 dark:hover:bg-gray-800">
              {isSidebarVisible ? <ChevronsLeft /> : <ChevronsRight />}
            </Button>
          </SimpleTooltip>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text">
            Workout Volume Tracker
          </h1>
        </div>

        {/* Desktop Navigation */} 
        <nav className="hidden md:flex items-center space-x-2">
          {navItems.map(item => (
            <Button
              key={item.view}
              variant={currentView === item.view ? 'secondary' : 'ghost'}
              onClick={() => setCurrentView(item.view)}
              className={`text-sm font-medium ${currentView === item.view ? 'bg-gray-700 dark:bg-gray-800 text-white' : 'hover:bg-gray-700 dark:hover:bg-gray-800'}`}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>

        <div className="flex items-center space-x-2">
          <SimpleTooltip content="Import Workout Plan (JSON)">
            <Button variant="ghost" size="icon" onClick={onImportClick} className="text-white hover:bg-gray-700 dark:hover:bg-gray-800">
              <FileUp className="h-5 w-5" />
            </Button>
          </SimpleTooltip>
          <SimpleTooltip content="Export Workout Plan (JSON)">
            <Button variant="ghost" size="icon" onClick={onExport} className="text-white hover:bg-gray-700 dark:hover:bg-gray-800">
              <FileDown className="h-5 w-5" />
            </Button>
          </SimpleTooltip>
          <SimpleTooltip content={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="text-white hover:bg-gray-700 dark:hover:bg-gray-800">
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </SimpleTooltip>
          <SimpleTooltip content="Reset All Data">
            <Button variant="destructive_outline" size="icon" onClick={onResetData} className="text-red-400 hover:bg-red-700 hover:text-white border-red-400">
              <RotateCcw className="h-5 w-5" />
            </Button>
          </SimpleTooltip>
          {/* Mobile Menu Button */} 
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setShowMobileMenu(!showMobileMenu)} className="text-white hover:bg-gray-700 dark:hover:bg-gray-800">
              {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */} 
      {showMobileMenu && (
        <div className="md:hidden mt-4 p-4 bg-gray-700 dark:bg-gray-800 rounded-md shadow-lg">
          <nav className="flex flex-col space-y-2">
            {navItems.map(item => (
              <Button
                key={item.view}
                variant={currentView === item.view ? 'secondary' : 'ghost'}
                onClick={() => {
                  setCurrentView(item.view);
                  setShowMobileMenu(false);
                }}
                className={`w-full justify-start text-white ${currentView === item.view ? 'bg-gray-600 dark:bg-gray-700' : 'hover:bg-gray-600 dark:hover:bg-gray-700'}`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default AppHeader;
