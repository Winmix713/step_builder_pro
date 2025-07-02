import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from './Button';
import Icon from '../AppIcon';

const StepNavigationControls = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isValidating, setIsValidating] = useState(false);

  const steps = [
    {
      id: 1,
      route: '/step-1-configuration-management',
      label: 'Configuration Management',
      validationRequired: true
    },
    {
      id: 2,
      route: '/step-2-svg-generation-and-editor',
      label: 'SVG Generation & Editor',
      validationRequired: true
    },
    {
      id: 3,
      route: '/step-3-css-implementation-tools',
      label: 'CSS Implementation Tools',
      validationRequired: true
    },
    {
      id: 4,
      route: '/step-4-final-code-generation',
      label: 'Final Code Generation',
      validationRequired: false
    }
  ];

  const [completedSteps, setCompletedSteps] = useState(() => {
    const saved = localStorage.getItem('stepBuilderPro_completedSteps');
    return saved ? JSON.parse(saved) : [];
  });

  const [stepValidation, setStepValidation] = useState(() => {
    const saved = localStorage.getItem('stepBuilderPro_stepValidation');
    return saved ? JSON.parse(saved) : {};
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
    return steps[getCurrentStepIndex()];
  };

  const getPreviousStep = () => {
    const currentIndex = getCurrentStepIndex();
    return currentIndex > 0 ? steps[currentIndex - 1] : null;
  };

  const getNextStep = () => {
    const currentIndex = getCurrentStepIndex();
    return currentIndex < steps.length - 1 ? steps[currentIndex + 1] : null;
  };

  const isCurrentStepValid = () => {
    const currentStep = getCurrentStep();
    if (!currentStep?.validationRequired) return true;
    return stepValidation[currentStep.id] === true;
  };

  const canNavigateNext = () => {
    return isCurrentStepValid() && getNextStep() !== null;
  };

  const canNavigatePrevious = () => {
    return getPreviousStep() !== null;
  };

  const validateCurrentStep = async () => {
    const currentStep = getCurrentStep();
    if (!currentStep?.validationRequired) return true;

    setIsValidating(true);
    
    try {
      // Simulate validation logic - replace with actual validation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const isValid = Math.random() > 0.2; // 80% success rate for demo
      
      const newValidation = { ...stepValidation, [currentStep.id]: isValid };
      setStepValidation(newValidation);
      localStorage.setItem('stepBuilderPro_stepValidation', JSON.stringify(newValidation));
      
      if (isValid && !completedSteps.includes(currentStep.id)) {
        const newCompleted = [...completedSteps, currentStep.id];
        setCompletedSteps(newCompleted);
        localStorage.setItem('stepBuilderPro_completedSteps', JSON.stringify(newCompleted));
      }
      
      return isValid;
    } catch (error) {
      console.error('Step validation failed:', error);
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handlePrevious = () => {
    const previousStep = getPreviousStep();
    if (previousStep) {
      navigate(previousStep.route);
    }
  };

  const handleNext = async () => {
    const nextStep = getNextStep();
    if (!nextStep) return;

    const currentStep = getCurrentStep();
    if (currentStep?.validationRequired && !isCurrentStepValid()) {
      const isValid = await validateCurrentStep();
      if (!isValid) {
        // Show validation error - could trigger a toast or modal
        return;
      }
    }

    navigate(nextStep.route);
  };

  const handleFinish = async () => {
    const currentStep = getCurrentStep();
    if (currentStep?.validationRequired && !isCurrentStepValid()) {
      const isValid = await validateCurrentStep();
      if (!isValid) return;
    }

    // Handle project completion
    const projectData = {
      completedSteps,
      stepValidation,
      completedAt: new Date().toISOString()
    };
    
    localStorage.setItem('stepBuilderPro_projectData', JSON.stringify(projectData));
    
    // Could navigate to a completion page or trigger export
    console.log('Project completed:', projectData);
  };

  const handleSaveProgress = () => {
    const progressData = {
      currentStep: getCurrentStep()?.id,
      completedSteps,
      stepValidation,
      savedAt: new Date().toISOString()
    };
    
    localStorage.setItem('stepBuilderPro_progress', JSON.stringify(progressData));
    
    // Show save confirmation
    console.log('Progress saved:', progressData);
  };

  const currentStepIndex = getCurrentStepIndex();
  const isLastStep = currentStepIndex === steps.length - 1;
  const currentStep = getCurrentStep();

  return (
    <>
      {/* Desktop Navigation Controls */}
      <div className="hidden md:block fixed bottom-8 right-8 z-40">
        <div className="flex items-center space-x-3">
          {/* Save Progress Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSaveProgress}
            className="shadow-elevation-2 bg-surface hover:bg-surface-50"
            iconName="Save"
            iconSize={16}
          >
            Save Progress
          </Button>

          {/* Previous Button */}
          <Button
            variant="secondary"
            size="md"
            onClick={handlePrevious}
            disabled={!canNavigatePrevious()}
            className="shadow-elevation-2"
            iconName="ChevronLeft"
            iconPosition="left"
            iconSize={16}
          >
            Previous
          </Button>

          {/* Next/Finish Button */}
          {isLastStep ? (
            <Button
              variant="success"
              size="md"
              onClick={handleFinish}
              loading={isValidating}
              className="shadow-elevation-2"
              iconName="Check"
              iconPosition="right"
              iconSize={16}
            >
              Finish Project
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              onClick={handleNext}
              disabled={!canNavigateNext()}
              loading={isValidating}
              className="shadow-elevation-2"
              iconName="ChevronRight"
              iconPosition="right"
              iconSize={16}
            >
              Next Step
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Controls */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border shadow-elevation-3">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Step Info */}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                isCurrentStepValid() ? 'bg-success-500' : currentStep?.validationRequired ?'bg-warning-500' : 'bg-secondary-300'
              }`} />
              <span className="text-sm text-text-secondary">
                Step {currentStepIndex + 1} of {steps.length}
              </span>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSaveProgress}
                iconName="Save"
                iconSize={16}
              />

              <Button
                variant="secondary"
                size="sm"
                onClick={handlePrevious}
                disabled={!canNavigatePrevious()}
                iconName="ChevronLeft"
                iconSize={16}
              />

              {isLastStep ? (
                <Button
                  variant="success"
                  size="sm"
                  onClick={handleFinish}
                  loading={isValidating}
                  iconName="Check"
                  iconSize={16}
                >
                  Finish
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleNext}
                  disabled={!canNavigateNext()}
                  loading={isValidating}
                  iconName="ChevronRight"
                  iconSize={16}
                >
                  Next
                </Button>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 w-full h-1 bg-secondary-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary-500 to-success-500 transition-all duration-300"
              style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Floating Validation Status */}
      {currentStep?.validationRequired && !isCurrentStepValid() && (
        <div className="fixed bottom-24 md:bottom-20 right-4 z-30">
          <div className="bg-warning-50 border border-warning-200 rounded-lg p-3 shadow-elevation-2 max-w-xs">
            <div className="flex items-start space-x-2">
              <Icon name="AlertTriangle" size={16} className="text-warning-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-warning-800">Validation Required</p>
                <p className="text-xs text-warning-700 mt-1">
                  Complete this step to continue
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Hint */}
      <div className="fixed bottom-4 left-4 z-30 hidden lg:block">
        <div className="bg-surface-50 border border-border rounded-md px-2 py-1 text-xs text-text-muted">
          <span className="font-mono">Ctrl+←</span> Previous • <span className="font-mono">Ctrl+→</span> Next
        </div>
      </div>
    </>
  );
};

export default StepNavigationControls;