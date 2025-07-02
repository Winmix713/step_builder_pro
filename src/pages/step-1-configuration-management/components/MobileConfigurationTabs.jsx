import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import ConfigurationForm from './ConfigurationForm';
import ConfigurationPreview from './ConfigurationPreview';

const MobileConfigurationTabs = ({ 
  configuration, 
  onConfigurationChange, 
  validationErrors, 
  onValidate,
  isValidating,
  validationStatus 
}) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('configure');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('stepBuilderPro_language');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const tabs = [
    {
      id: 'configure',
      label: 'Configure',
      icon: 'Settings',
      badge: Object.keys(validationErrors).length > 0 ? Object.keys(validationErrors).length : null
    },
    {
      id: 'preview',
      label: 'Preview',
      icon: 'Eye',
      badge: validationStatus === 'valid' ? '✓' : null
    }
  ];

  return (
    <div className="flex flex-col h-full bg-surface">
      {/* Tab Navigation */}
      <div className="flex border-b border-border bg-surface-50">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium transition-colors duration-200 border-b-2 relative ${
              activeTab === tab.id
                ? 'text-primary-600 border-primary-500 bg-surface' :'text-text-secondary border-transparent hover:text-text-primary hover:bg-surface'
            }`}
          >
            <Icon name={tab.icon} size={16} />
            <span>{tab.label}</span>
            {tab.badge && (
              <div className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-xs font-bold rounded-full ${
                typeof tab.badge === 'number' ?'bg-error-500 text-white' :'bg-success-500 text-white'
              }`}>
                {tab.badge}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'configure' && (
          <div className="h-full overflow-auto p-4">
            <ConfigurationForm
              configuration={configuration}
              onConfigurationChange={onConfigurationChange}
              validationErrors={validationErrors}
              onValidate={onValidate}
              isValidating={isValidating}
            />
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="h-full">
            <ConfigurationPreview
              configuration={configuration}
              validationStatus={validationStatus}
            />
          </div>
        )}
      </div>

      {/* Mobile Quick Actions */}
      <div className="p-3 border-t border-border bg-surface-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              validationStatus === 'valid' ? 'bg-success-500' : 
              validationStatus === 'invalid' ? 'bg-error-500' : 
              validationStatus === 'warning' ? 'bg-warning-500' : 'bg-secondary-300'
            }`} />
            <span className="text-xs text-text-muted">
              {validationStatus === 'valid' ? 'Configuration Valid' :
               validationStatus === 'invalid' ? 'Validation Required' :
               validationStatus === 'warning' ? 'Check Configuration' : 'Not Validated'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab(activeTab === 'configure' ? 'preview' : 'configure')}
              className="flex items-center space-x-1 px-2 py-1 text-xs text-text-secondary hover:text-text-primary transition-colors duration-200"
            >
              <Icon name="ArrowLeftRight" size={12} />
              <span>Switch</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileConfigurationTabs;