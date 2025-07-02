import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const MobileTabInterface = ({ 
  cssCode, 
  onCSSChange, 
  selectedFramework, 
  onValidationChange,
  children 
}) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('code');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const tabs = [
    { id: 'code', name: 'Code', icon: 'Code', description: 'CSS Editor' },
    { id: 'preview', name: 'Preview', icon: 'Eye', description: 'Live Preview' },
    { id: 'settings', name: 'Settings', icon: 'Settings', description: 'Configuration' }
  ];

  useEffect(() => {
    const savedLanguage = localStorage.getItem('stepBuilderPro_language');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const renderTabContent = () => {
    // This component acts as a wrapper for mobile layout
    // The actual content is passed as children
    return children;
  };

  return (
    <div className={`md:hidden flex flex-col h-full ${isFullscreen ? 'fixed inset-0 z-50 bg-surface' : ''}`}>
      {/* Mobile Header */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-surface-50">
        <div className="flex items-center space-x-2">
          <Icon name="Palette" size={16} className="text-primary-500" />
          <span className="text-sm font-medium text-text-primary">CSS Tools</span>
          {selectedFramework && (
            <div className="px-2 py-1 text-xs bg-primary-50 text-primary-700 rounded">
              {selectedFramework}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            iconName={isFullscreen ? "Minimize2" : "Maximize2"}
            iconSize={14}
          />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-border bg-surface">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-2 text-sm font-medium transition-colors duration-200 ${
              activeTab === tab.id
                ? 'text-primary-600 border-b-2 border-primary-500 bg-primary-50' :'text-text-secondary hover:text-text-primary hover:bg-surface-50'
            }`}
          >
            <Icon name={tab.icon} size={16} />
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {renderTabContent()}
      </div>

      {/* Mobile Footer */}
      <div className="flex items-center justify-between p-3 border-t border-border bg-surface-50">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            activeTab === 'code' ? 'bg-accent-500' : 
            activeTab === 'preview' ? 'bg-success-500' : 'bg-secondary-300'
          }`} />
          <span className="text-xs text-text-muted">
            {tabs.find(tab => tab.id === activeTab)?.description}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {cssCode && (
            <span className="text-xs text-text-muted">
              {cssCode.length} chars
            </span>
          )}
        </div>
      </div>

      {/* Quick Actions Floating Button */}
      {activeTab === 'code' && (
        <div className="fixed bottom-20 right-4 z-40">
          <div className="flex flex-col space-y-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                // Format CSS
                if (onCSSChange && cssCode) {
                  const formatted = cssCode
                    .replace(/\s*{\s*/g, ' {\n  ')
                    .replace(/;\s*/g, ';\n  ')
                    .replace(/\s*}\s*/g, '\n}\n\n')
                    .trim();
                  onCSSChange(formatted);
                }
              }}
              iconName="AlignLeft"
              iconSize={14}
              className="shadow-elevation-2"
            >
              Format
            </Button>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={async () => {
                if (cssCode) {
                  try {
                    await navigator.clipboard.writeText(cssCode);
                  } catch (error) {
                    console.error('Failed to copy CSS:', error);
                  }
                }
              }}
              iconName="Copy"
              iconSize={14}
              className="shadow-elevation-2"
            >
              Copy
            </Button>
          </div>
        </div>
      )}

      {/* Swipe Indicator */}
      <div className="absolute top-1/2 left-2 transform -translate-y-1/2 opacity-30 pointer-events-none">
        <div className="flex flex-col space-y-1">
          <div className="w-1 h-8 bg-text-muted rounded-full" />
          <div className="w-1 h-4 bg-text-muted rounded-full" />
        </div>
      </div>
      
      <div className="absolute top-1/2 right-2 transform -translate-y-1/2 opacity-30 pointer-events-none">
        <div className="flex flex-col space-y-1">
          <div className="w-1 h-8 bg-text-muted rounded-full" />
          <div className="w-1 h-4 bg-text-muted rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default MobileTabInterface;