import React, { useState, useEffect, useRef } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ConfigurationToolbar = ({ 
  onLoadTemplate, 
  onSaveTemplate, 
  onImportConfig, 
  onExportConfig,
  validationStatus,
  autoSaveEnabled,
  onToggleAutoSave 
}) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isTemplateMenuOpen, setIsTemplateMenuOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const templateMenuRef = useRef(null);
  const fileInputRef = useRef(null);

  const templates = [
    {
      id: 'react-basic',
      name: 'React Basic',
      description: 'Simple React app with minimal configuration',
      icon: 'Zap',
      config: {
        projectName: 'My React App',
        reactVersion: '18.2.0',
        buildTool: 'vite',
        cssFramework: 'tailwind',
        typescript: false,
        routing: false,
        stateManagement: 'context'
      }
    },
    {
      id: 'react-advanced',
      name: 'React Advanced',
      description: 'Full-featured React app with all modern tools',
      icon: 'Rocket',
      config: {
        projectName: 'Advanced React App',
        reactVersion: '18.2.0',
        buildTool: 'vite',
        cssFramework: 'tailwind',
        typescript: true,
        routing: true,
        stateManagement: 'redux',
        formHandling: 'react-hook-form',
        testing: true,
        eslint: true,
        darkMode: true,
        responsive: true,
        animations: 'framer-motion',
        codesplitting: true,
        pwa: true,
        i18n: true
      }
    },
    {
      id: 'react-dashboard',
      name: 'Dashboard Template',
      description: 'Perfect for admin panels and dashboards',
      icon: 'BarChart3',
      config: {
        projectName: 'Dashboard App',
        reactVersion: '18.2.0',
        buildTool: 'vite',
        cssFramework: 'tailwind',
        typescript: true,
        routing: true,
        stateManagement: 'redux',
        formHandling: 'react-hook-form',
        testing: true,
        darkMode: true,
        responsive: true,
        animations: 'framer-motion',
        analytics: 'google'
      }
    },
    {
      id: 'react-ecommerce',
      name: 'E-commerce Template',
      description: 'Optimized for online stores and shopping sites',
      icon: 'ShoppingCart',
      config: {
        projectName: 'E-commerce App',
        reactVersion: '18.2.0',
        buildTool: 'vite',
        cssFramework: 'tailwind',
        typescript: true,
        routing: true,
        stateManagement: 'redux',
        formHandling: 'react-hook-form',
        testing: true,
        darkMode: false,
        responsive: true,
        animations: 'framer-motion',
        pwa: true,
        analytics: 'google',
        bundleSize: 8
      }
    }
  ];

  useEffect(() => {
    const savedLanguage = localStorage.getItem('stepBuilderPro_language');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (templateMenuRef.current && !templateMenuRef.current.contains(event.target)) {
        setIsTemplateMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template.id);
    onLoadTemplate(template.config);
    setIsTemplateMenuOpen(false);
  };

  const handleImportFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedConfig = JSON.parse(e.target.result);
        onImportConfig(importedConfig);
      } catch (error) {
        console.error('Failed to import configuration:', error);
        // Could show error toast
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
  };

  const handleExport = () => {
    onExportConfig();
  };

  const getValidationStatusIcon = () => {
    switch (validationStatus) {
      case 'valid':
        return { icon: 'CheckCircle', color: 'text-success-500' };
      case 'invalid':
        return { icon: 'XCircle', color: 'text-error-500' };
      case 'warning':
        return { icon: 'AlertTriangle', color: 'text-warning-500' };
      default:
        return { icon: 'Clock', color: 'text-text-muted' };
    }
  };

  const statusIcon = getValidationStatusIcon();

  return (
    <div className="flex items-center justify-between p-4 bg-surface border-b border-border">
      {/* Left Section - Templates and Actions */}
      <div className="flex items-center space-x-3">
        {/* Template Selector */}
        <div className="relative" ref={templateMenuRef}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsTemplateMenuOpen(!isTemplateMenuOpen)}
            iconName="Template"
            iconPosition="left"
            iconSize={16}
          >
            Templates
            <Icon name="ChevronDown" size={14} className="ml-1" />
          </Button>

          {isTemplateMenuOpen && (
            <div className="absolute top-full left-0 mt-2 w-80 bg-surface border border-border rounded-lg shadow-elevation-3 z-50">
              <div className="p-2">
                <div className="text-xs font-medium text-text-secondary px-2 py-1 mb-2">
                  Choose a template to get started quickly
                </div>
                {templates.map(template => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className={`w-full flex items-start space-x-3 p-3 rounded-md hover:bg-surface-50 transition-colors duration-200 text-left ${
                      selectedTemplate === template.id ? 'bg-primary-50 border border-primary-200' : ''
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
                      selectedTemplate === template.id ? 'bg-primary-500 text-white' : 'bg-surface-100 text-text-secondary'
                    }`}>
                      <Icon name={template.icon} size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-text-primary">{template.name}</div>
                      <div className="text-xs text-text-muted mt-0.5">{template.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Import/Export Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            iconName="Upload"
            iconSize={16}
          >
            Import
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExport}
            iconName="Download"
            iconSize={16}
          >
            Export
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportFile}
            className="hidden"
          />
        </div>
      </div>

      {/* Right Section - Status and Settings */}
      <div className="flex items-center space-x-4">
        {/* Auto-save Toggle */}
        <div className="flex items-center space-x-2">
          <Icon name="Save" size={14} className="text-text-secondary" />
          <span className="text-sm text-text-secondary hidden sm:inline">Auto-save</span>
          <button
            onClick={onToggleAutoSave}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${
              autoSaveEnabled ? 'bg-primary-500' : 'bg-secondary-200'
            }`}
          >
            <span
              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200 ${
                autoSaveEnabled ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Validation Status */}
        <div className="flex items-center space-x-2 px-3 py-1.5 bg-surface-50 rounded-md border border-border">
          <Icon name={statusIcon.icon} size={14} className={statusIcon.color} />
          <span className="text-sm text-text-secondary hidden md:inline">
            {validationStatus === 'valid' ? 'Valid' :
             validationStatus === 'invalid' ? 'Invalid' :
             validationStatus === 'warning' ? 'Warning' : 'Pending'}
          </span>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSaveTemplate}
            iconName="Bookmark"
            iconSize={16}
            className="hidden lg:flex"
          >
            Save as Template
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            iconName="RotateCcw"
            iconSize={16}
            onClick={() => window.location.reload()}
          />
          
          <Button
            variant="ghost"
            size="sm"
            iconName="Settings"
            iconSize={16}
          />
        </div>
      </div>
    </div>
  );
};

export default ConfigurationToolbar;