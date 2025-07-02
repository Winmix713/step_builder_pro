import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const StepProgressHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const steps = [
    {
      id: 1,
      label: 'Configuration Management',
      route: '/step-1-configuration-management',
      icon: 'Settings',
      description: 'Set up project configuration and initial parameters',
      estimatedTime: '5-10 min'
    },
    {
      id: 2,
      label: 'SVG Generation & Editor',
      route: '/step-2-svg-generation-and-editor',
      icon: 'Image',
      description: 'Create and customize SVG graphics',
      estimatedTime: '10-15 min'
    },
    {
      id: 3,
      label: 'CSS Implementation Tools',
      route: '/step-3-css-implementation-tools',
      icon: 'Palette',
      description: 'Apply styling and CSS customizations',
      estimatedTime: '15-20 min'
    },
    {
      id: 4,
      label: 'Final Code Generation',
      route: '/step-4-final-code-generation',
      icon: 'Code',
      description: 'Generate and export final code output',
      estimatedTime: '5-10 min'
    }
  ];

  const [completedSteps, setCompletedSteps] = useState(() => {
    const saved = localStorage.getItem('stepBuilderPro_completedSteps');
    return saved ? JSON.parse(saved) : [];
  });

  const [projectContext, setProjectContext] = useState(() => {
    const saved = localStorage.getItem('stepBuilderPro_projectContext');
    return saved ? JSON.parse(saved) : {
      name: 'Untitled Project',
      lastSaved: null,
      autoSaveEnabled: true
    };
  });

  useEffect(() => {
    const savedLanguage = localStorage.getItem('stepBuilderPro_language');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.route === location.pathname);
  };

  const getCurrentStep = () => {
    return steps.find(step => step.route === location.pathname);
  };

  const getStepStatus = (stepId) => {
    const currentIndex = getCurrentStepIndex();
    const stepIndex = stepId - 1;
    
    if (completedSteps.includes(stepId)) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    if (stepIndex < currentIndex) return 'available';
    return 'pending';
  };

  const handleStepClick = (step) => {
    const stepStatus = getStepStatus(step.id);
    if (stepStatus === 'completed' || stepStatus === 'available' || stepStatus === 'active') {
      navigate(step.route);
    }
  };

  const handleKeyDown = (e, step) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleStepClick(step);
    }
  };

  const getCompletionPercentage = () => {
    return Math.round((completedSteps.length / steps.length) * 100);
  };

  const renderStepIndicator = (step) => {
    const status = getStepStatus(step.id);
    const isClickable = status === 'completed' || status === 'available' || status === 'active';

    return (
      <div
        key={step.id}
        className={`flex items-center group ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
        onClick={() => handleStepClick(step)}
        onKeyDown={(e) => handleKeyDown(e, step)}
        tabIndex={isClickable ? 0 : -1}
        role="button"
        aria-label={`Step ${step.id}: ${step.label} - ${status}`}
      >
        <div className="flex items-center min-w-0">
          <div className={`step-progress-ring ${status}`}>
            <div className={`step-indicator ${status}`}>
              {status === 'completed' ? (
                <Icon name="Check" size={16} className="text-white" />
              ) : status === 'active' ? (
                <span className="text-white font-medium">{step.id}</span>
              ) : (
                <span className={`font-medium ${status === 'pending' ? 'text-text-muted' : 'text-text-secondary'}`}>
                  {step.id}
                </span>
              )}
            </div>
          </div>
          
          <div className="ml-3 min-w-0 hidden sm:block">
            <div className={`text-sm font-medium transition-colors duration-200 ${
              status === 'active' ? 'text-primary-600' : 
              status === 'completed' ? 'text-success-600' : 
              status === 'pending' ? 'text-text-muted' : 'text-text-secondary'
            }`}>
              {step.label}
            </div>
            <div className="text-xs text-text-muted mt-0.5 hidden lg:block">
              {step.estimatedTime}
            </div>
          </div>
        </div>

        {step.id < steps.length && (
          <div className={`hidden sm:block w-12 h-px mx-4 transition-colors duration-300 ${
            completedSteps.includes(step.id) ? 'bg-success-300' : 'bg-secondary-200'
          }`} />
        )}
      </div>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-border shadow-elevation-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                  <Icon name="Zap" size={20} className="text-white" />
                </div>
                <div className="ml-3 hidden sm:block">
                  <h1 className="text-lg font-semibold text-text-primary">Step Builder Pro</h1>
                </div>
              </div>
            </div>
          </div>

          {/* Step Progress Navigation */}
          <div className="flex-1 flex justify-center max-w-4xl mx-8">
            <nav className="flex items-center space-x-1 sm:space-x-0" role="navigation" aria-label="Step progress">
              {steps.map(renderStepIndicator)}
            </nav>
          </div>

          {/* Project Context and Actions */}
          <div className="flex items-center space-x-4">
            {/* Progress Indicator */}
            <div className="hidden md:flex items-center space-x-2">
              <div className="text-xs text-text-secondary">
                {getCompletionPercentage()}% Complete
              </div>
              <div className="w-16 h-2 bg-secondary-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-success-500 transition-all duration-500 ease-out"
                  style={{ width: `${getCompletionPercentage()}%` }}
                />
              </div>
            </div>

            {/* Auto-save Status */}
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${
                projectContext.autoSaveEnabled ? 'bg-success-500' : 'bg-secondary-300'
              }`} />
              <span className="text-xs text-text-secondary hidden lg:inline">
                {projectContext.lastSaved ? 'Saved' : 'Auto-save'}
              </span>
            </div>

            {/* Project Menu */}
            <div className="relative">
              <button
                className="flex items-center space-x-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors duration-200 rounded-md hover:bg-surface-50"
                aria-label="Project menu"
              >
                <Icon name="MoreVertical" size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Step Indicator */}
      <div className="sm:hidden border-t border-border bg-surface-50">
        <div className="px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name={getCurrentStep()?.icon || 'Circle'} size={16} className="text-primary-500" />
              <span className="text-sm font-medium text-text-primary">
                Step {getCurrentStepIndex() + 1}: {getCurrentStep()?.label}
              </span>
            </div>
            <div className="text-xs text-text-secondary">
              {getCurrentStepIndex() + 1} of {steps.length}
            </div>
          </div>
          <div className="mt-2 w-full h-1 bg-secondary-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-500 transition-all duration-300"
              style={{ width: `${((getCurrentStepIndex() + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default StepProgressHeader;