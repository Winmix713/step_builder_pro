import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import StepProgressHeader from '../../components/ui/StepProgressHeader';
import StepNavigationControls from '../../components/ui/StepNavigationControls';
import ProjectContextIndicator from '../../components/ui/ProjectContextIndicator';
import ConfigurationToolbar from './components/ConfigurationToolbar';
import ConfigurationForm from './components/ConfigurationForm';
import ConfigurationPreview from './components/ConfigurationPreview';
import MobileConfigurationTabs from './components/MobileConfigurationTabs';

const ConfigurationManagement = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isMobile, setIsMobile] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState('pending');
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);

  const [configuration, setConfiguration] = useState(() => {
    const saved = localStorage.getItem('stepBuilderPro_step1_configuration');
    return saved ? JSON.parse(saved) : {
      projectName: '',
      projectDescription: '',
      version: '1.0.0',
      author: '',
      reactVersion: '18.2.0',
      buildTool: 'vite',
      typescript: false,
      eslint: true,
      cssFramework: 'tailwind',
      darkMode: true,
      responsive: true,
      animations: 'framer-motion',
      routing: false,
      stateManagement: 'context',
      formHandling: 'react-hook-form',
      testing: false,
      bundleSize: 5,
      codesplitting: false,
      pwa: false,
      i18n: false,
      analytics: 'none'
    };
  });

  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const savedLanguage = localStorage.getItem('stepBuilderPro_language');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (autoSaveEnabled) {
      const timer = setTimeout(() => {
        handleSaveConfiguration();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [configuration, autoSaveEnabled]);

  const handleConfigurationChange = (newConfiguration) => {
    setConfiguration(newConfiguration);
    
    // Clear validation errors for changed fields
    const updatedErrors = { ...validationErrors };
    Object.keys(newConfiguration).forEach(key => {
      if (newConfiguration[key] !== configuration[key]) {
        delete updatedErrors[key];
      }
    });
    setValidationErrors(updatedErrors);
    
    // Reset validation status if configuration changes
    if (validationStatus === 'valid') {
      setValidationStatus('pending');
    }
  };

  const handleSaveConfiguration = () => {
    localStorage.setItem('stepBuilderPro_step1_configuration', JSON.stringify(configuration));
    setLastSaved(new Date());
  };

  const validateConfiguration = async () => {
    setIsValidating(true);
    const errors = {};

    try {
      // Simulate validation delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Project validation
      if (!configuration.projectName?.trim()) {
        errors.projectName = 'Project name is required';
      } else if (configuration.projectName.length < 3) {
        errors.projectName = 'Project name must be at least 3 characters';
      }

      if (!configuration.projectDescription?.trim()) {
        errors.projectDescription = 'Project description is required';
      }

      if (!configuration.author?.trim()) {
        errors.author = 'Author name is required';
      }

      // Version validation
      const versionRegex = /^\d+\.\d+\.\d+$/;
      if (!versionRegex.test(configuration.version)) {
        errors.version = 'Version must follow semantic versioning (e.g., 1.0.0)';
      }

      // Framework validation
      if (!configuration.reactVersion) {
        errors.reactVersion = 'React version is required';
      }

      if (!configuration.buildTool) {
        errors.buildTool = 'Build tool selection is required';
      }

      if (!configuration.cssFramework) {
        errors.cssFramework = 'CSS framework selection is required';
      }

      // Advanced validation
      if (configuration.bundleSize < 1 || configuration.bundleSize > 10) {
        errors.bundleSize = 'Bundle size optimization must be between 1 and 10';
      }

      setValidationErrors(errors);
      
      const hasErrors = Object.keys(errors).length > 0;
      setValidationStatus(hasErrors ? 'invalid' : 'valid');

      // Update step completion status
      if (!hasErrors) {
        const completedSteps = JSON.parse(localStorage.getItem('stepBuilderPro_completedSteps') || '[]');
        if (!completedSteps.includes(1)) {
          completedSteps.push(1);
          localStorage.setItem('stepBuilderPro_completedSteps', JSON.stringify(completedSteps));
        }
        
        const stepValidation = JSON.parse(localStorage.getItem('stepBuilderPro_stepValidation') || '{}');
        stepValidation[1] = true;
        localStorage.setItem('stepBuilderPro_stepValidation', JSON.stringify(stepValidation));
      }

      return !hasErrors;
    } catch (error) {
      console.error('Validation failed:', error);
      setValidationStatus('invalid');
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handleLoadTemplate = (templateConfig) => {
    setConfiguration({ ...configuration, ...templateConfig });
    setValidationStatus('pending');
    setValidationErrors({});
  };

  const handleSaveTemplate = () => {
    const templates = JSON.parse(localStorage.getItem('stepBuilderPro_customTemplates') || '[]');
    const newTemplate = {
      id: `custom-${Date.now()}`,
      name: configuration.projectName || 'Custom Template',
      description: 'User-created template',
      config: configuration,
      createdAt: new Date().toISOString()
    };
    
    templates.push(newTemplate);
    localStorage.setItem('stepBuilderPro_customTemplates', JSON.stringify(templates));
  };

  const handleImportConfig = (importedConfig) => {
    setConfiguration({ ...configuration, ...importedConfig });
    setValidationStatus('pending');
    setValidationErrors({});
  };

  const handleExportConfig = () => {
    const exportData = {
      configuration,
      validationStatus,
      exportedAt: new Date().toISOString(),
      version: '1.0.0'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${configuration.projectName || 'configuration'}_step1.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleToggleAutoSave = () => {
    setAutoSaveEnabled(!autoSaveEnabled);
    localStorage.setItem('stepBuilderPro_autoSave', JSON.stringify(!autoSaveEnabled));
  };

  return (
    <>
      <Helmet>
        <title>Step 1: Configuration Management - Step Builder Pro</title>
        <meta name="description" content="Configure your React project settings, framework options, and build tools with real-time validation and preview." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Fixed Header */}
        <StepProgressHeader />

        {/* Main Content */}
        <main className="pt-16 lg:pt-20 pb-20 lg:pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Page Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-text-primary">
                    Configuration Management
                  </h1>
                  <p className="text-text-secondary mt-2">
                    Set up your project parameters and framework configuration with real-time validation.
                  </p>
                </div>
                <div className="hidden lg:block">
                  <ProjectContextIndicator />
                </div>
              </div>
            </div>

            {/* Configuration Toolbar */}
            <ConfigurationToolbar
              onLoadTemplate={handleLoadTemplate}
              onSaveTemplate={handleSaveTemplate}
              onImportConfig={handleImportConfig}
              onExportConfig={handleExportConfig}
              validationStatus={validationStatus}
              autoSaveEnabled={autoSaveEnabled}
              onToggleAutoSave={handleToggleAutoSave}
            />

            {/* Main Configuration Interface */}
            <div className="mt-6">
              {isMobile ? (
                /* Mobile Layout - Tabbed Interface */
                <div className="h-[calc(100vh-280px)] border border-border rounded-lg overflow-hidden">
                  <MobileConfigurationTabs
                    configuration={configuration}
                    onConfigurationChange={handleConfigurationChange}
                    validationErrors={validationErrors}
                    onValidate={validateConfiguration}
                    isValidating={isValidating}
                    validationStatus={validationStatus}
                  />
                </div>
              ) : (
                /* Desktop Layout - Split Panel */
                <div className="grid grid-cols-12 gap-6 h-[calc(100vh-280px)]">
                  {/* Left Panel - Configuration Form */}
                  <div className="col-span-7 bg-surface border border-border rounded-lg overflow-hidden">
                    <div className="h-full overflow-auto p-6">
                      <ConfigurationForm
                        configuration={configuration}
                        onConfigurationChange={handleConfigurationChange}
                        validationErrors={validationErrors}
                        onValidate={validateConfiguration}
                        isValidating={isValidating}
                      />
                    </div>
                  </div>

                  {/* Right Panel - Live Preview */}
                  <div className="col-span-5">
                    <ConfigurationPreview
                      configuration={configuration}
                      validationStatus={validationStatus}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Auto-save Status */}
            {lastSaved && (
              <div className="mt-4 flex items-center justify-center">
                <div className="flex items-center space-x-2 px-3 py-1 bg-success-50 border border-success-200 rounded-md text-xs text-success-700">
                  <div className="w-1.5 h-1.5 bg-success-500 rounded-full" />
                  <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Navigation Controls */}
        <StepNavigationControls />
      </div>
    </>
  );
};

export default ConfigurationManagement;