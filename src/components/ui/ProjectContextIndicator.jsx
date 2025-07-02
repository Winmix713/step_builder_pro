import React, { useState, useEffect, useRef } from 'react';
import Button from './Button';
import Icon from '../AppIcon';

const ProjectContextIndicator = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('saved');
  const menuRef = useRef(null);

  const [projectContext, setProjectContext] = useState(() => {
    const saved = localStorage.getItem('stepBuilderPro_projectContext');
    return saved ? JSON.parse(saved) : {
      name: 'Untitled Project',
      lastSaved: new Date().toISOString(),
      autoSaveEnabled: true,
      version: '1.0.0',
      createdAt: new Date().toISOString()
    };
  });

  useEffect(() => {
    const savedLanguage = localStorage.getItem('stepBuilderPro_language');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Simulate auto-save status changes
    const interval = setInterval(() => {
      if (projectContext.autoSaveEnabled) {
        setAutoSaveStatus(prev => {
          if (prev === 'saving') return 'saved';
          if (Math.random() > 0.8) return 'saving';
          return 'saved';
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [projectContext.autoSaveEnabled]);

  const handleProjectNameChange = (newName) => {
    const updatedContext = {
      ...projectContext,
      name: newName,
      lastSaved: new Date().toISOString()
    };
    setProjectContext(updatedContext);
    localStorage.setItem('stepBuilderPro_projectContext', JSON.stringify(updatedContext));
  };

  const handleAutoSaveToggle = () => {
    const updatedContext = {
      ...projectContext,
      autoSaveEnabled: !projectContext.autoSaveEnabled,
      lastSaved: new Date().toISOString()
    };
    setProjectContext(updatedContext);
    localStorage.setItem('stepBuilderPro_projectContext', JSON.stringify(updatedContext));
  };

  const handleExportProject = () => {
    const projectData = {
      ...projectContext,
      completedSteps: JSON.parse(localStorage.getItem('stepBuilderPro_completedSteps') || '[]'),
      stepValidation: JSON.parse(localStorage.getItem('stepBuilderPro_stepValidation') || '{}'),
      progress: JSON.parse(localStorage.getItem('stepBuilderPro_progress') || '{}'),
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectContext.name.replace(/\s+/g, '_')}_export.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setIsMenuOpen(false);
  };

  const handleImportProject = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        
        // Update project context
        setProjectContext(importedData);
        localStorage.setItem('stepBuilderPro_projectContext', JSON.stringify(importedData));
        
        // Update other data if present
        if (importedData.completedSteps) {
          localStorage.setItem('stepBuilderPro_completedSteps', JSON.stringify(importedData.completedSteps));
        }
        if (importedData.stepValidation) {
          localStorage.setItem('stepBuilderPro_stepValidation', JSON.stringify(importedData.stepValidation));
        }
        if (importedData.progress) {
          localStorage.setItem('stepBuilderPro_progress', JSON.stringify(importedData.progress));
        }
        
        setIsMenuOpen(false);
        // Could trigger a page refresh or state update
        window.location.reload();
      } catch (error) {
        console.error('Failed to import project:', error);
        // Could show error toast
      }
    };
    reader.readAsText(file);
  };

  const handleNewProject = () => {
    const newContext = {
      name: 'Untitled Project',
      lastSaved: new Date().toISOString(),
      autoSaveEnabled: true,
      version: '1.0.0',
      createdAt: new Date().toISOString()
    };
    
    setProjectContext(newContext);
    localStorage.setItem('stepBuilderPro_projectContext', JSON.stringify(newContext));
    localStorage.removeItem('stepBuilderPro_completedSteps');
    localStorage.removeItem('stepBuilderPro_stepValidation');
    localStorage.removeItem('stepBuilderPro_progress');
    
    setIsMenuOpen(false);
    window.location.href = '/step-1-configuration-management';
  };

  const getAutoSaveStatusIcon = () => {
    switch (autoSaveStatus) {
      case 'saving':
        return <Icon name="Loader2" size={12} className="text-accent-500 animate-spin" />;
      case 'saved':
        return <Icon name="Check" size={12} className="text-success-500" />;
      case 'error':
        return <Icon name="AlertCircle" size={12} className="text-error-500" />;
      default:
        return <Icon name="Circle" size={12} className="text-secondary-300" />;
    }
  };

  const formatLastSaved = () => {
    if (!projectContext.lastSaved) return 'Never';
    const date = new Date(projectContext.lastSaved);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Main Indicator Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors duration-200 rounded-md hover:bg-surface-50 group"
        aria-label="Project context menu"
      >
        {/* Project Status Indicator */}
        <div className="flex items-center space-x-1.5">
          {getAutoSaveStatusIcon()}
          <span className="hidden lg:inline font-medium text-text-primary max-w-32 truncate">
            {projectContext.name}
          </span>
        </div>
        
        <Icon 
          name="ChevronDown" 
          size={14} 
          className={`transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-surface border border-border rounded-lg shadow-elevation-3 z-50 animate-slide-down">
          {/* Project Info Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <input
                  type="text"
                  value={projectContext.name}
                  onChange={(e) => handleProjectNameChange(e.target.value)}
                  className="text-sm font-medium text-text-primary bg-transparent border-none outline-none w-full focus:bg-surface-50 rounded px-1 py-0.5"
                  placeholder="Project name"
                />
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-text-muted">
                    Last saved: {formatLastSaved()}
                  </span>
                  <div className="flex items-center space-x-1">
                    {getAutoSaveStatusIcon()}
                    <span className="text-xs text-text-muted">
                      {autoSaveStatus === 'saving' ? 'Saving...' : 
                       autoSaveStatus === 'saved' ? 'Saved' : 
                       autoSaveStatus === 'error' ? 'Error' : 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Auto-save Toggle */}
          <div className="p-3 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon name="Save" size={16} className="text-text-secondary" />
                <span className="text-sm text-text-primary">Auto-save</span>
              </div>
              <button
                onClick={handleAutoSaveToggle}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${
                  projectContext.autoSaveEnabled ? 'bg-primary-500' : 'bg-secondary-200'
                }`}
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200 ${
                    projectContext.autoSaveEnabled ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Project Actions */}
          <div className="p-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNewProject}
              className="w-full justify-start"
              iconName="Plus"
              iconSize={16}
            >
              New Project
            </Button>
            
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                iconName="Upload"
                iconSize={16}
                onClick={() => document.getElementById('import-file').click()}
              >
                Import Project
              </Button>
              <input
                id="import-file"
                type="file"
                accept=".json"
                onChange={handleImportProject}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExportProject}
              className="w-full justify-start"
              iconName="Download"
              iconSize={16}
            >
              Export Project
            </Button>
          </div>

          {/* Project Stats */}
          <div className="p-3 border-t border-border bg-surface-50">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-text-muted">Version</span>
                <div className="font-medium text-text-primary">{projectContext.version}</div>
              </div>
              <div>
                <span className="text-text-muted">Created</span>
                <div className="font-medium text-text-primary">
                  {new Date(projectContext.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectContextIndicator;