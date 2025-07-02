import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const CSSControlBar = ({ 
  selectedFramework, 
  onFrameworkChange, 
  customProperties, 
  onCustomPropertiesChange,
  onImport,
  onExport 
}) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [showCustomProperties, setShowCustomProperties] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [newProperty, setNewProperty] = useState({ name: '', value: '' });

  const cssFrameworks = [
    { id: 'vanilla', name: 'Vanilla CSS', description: 'Pure CSS without any framework' },
    { id: 'tailwind', name: 'Tailwind CSS', description: 'Utility-first CSS framework' },
    { id: 'bootstrap', name: 'Bootstrap', description: 'Popular CSS framework with components' },
    { id: 'bulma', name: 'Bulma', description: 'Modern CSS framework based on Flexbox' },
    { id: 'foundation', name: 'Foundation', description: 'Responsive front-end framework' },
    { id: 'materialize', name: 'Materialize', description: 'CSS framework based on Material Design' }
  ];

  const presetTemplates = [
    {
      id: 'modern-card',
      name: 'Modern Card',
      description: 'Clean card design with shadows and hover effects',
      css: `.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: all 0.3s ease;
  border: 1px solid #f1f5f9;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}`
    },
    {
      id: 'gradient-button',
      name: 'Gradient Button',
      description: 'Stylish button with gradient background',
      css: `.btn-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  color: white;
  padding: 12px 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-gradient:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
}

.btn-gradient:active {
  transform: translateY(0);
}`
    },
    {
      id: 'glassmorphism',
      name: 'Glassmorphism',
      description: 'Modern glass effect with backdrop blur',
      css: `.glass {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  padding: 2rem;
}

.glass-dark {
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: white;
}`
    }
  ];

  useEffect(() => {
    const savedLanguage = localStorage.getItem('stepBuilderPro_language');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const handleAddCustomProperty = () => {
    if (newProperty.name && newProperty.value) {
      const updatedProperties = {
        ...customProperties,
        [newProperty.name]: newProperty.value
      };
      onCustomPropertiesChange?.(updatedProperties);
      setNewProperty({ name: '', value: '' });
    }
  };

  const handleRemoveCustomProperty = (propertyName) => {
    const updatedProperties = { ...customProperties };
    delete updatedProperties[propertyName];
    onCustomPropertiesChange?.(updatedProperties);
  };

  const handleImportCSS = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const cssContent = e.target.result;
        onImport?.(cssContent);
        setShowImportModal(false);
      } catch (error) {
        console.error('Failed to import CSS:', error);
      }
    };
    reader.readAsText(file);
  };

  const handleExportCSS = () => {
    onExport?.();
  };

  const handleTemplateSelect = (template) => {
    onImport?.(template.css);
  };

  return (
    <>
      <div className="bg-surface border-b border-border p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Framework Selection */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Icon name="Palette" size={16} className="text-text-secondary" />
              <span className="text-sm font-medium text-text-primary">Framework:</span>
            </div>
            
            <select
              value={selectedFramework}
              onChange={(e) => onFrameworkChange?.(e.target.value)}
              className="px-3 py-2 text-sm border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {cssFrameworks.map((framework) => (
                <option key={framework.id} value={framework.id}>
                  {framework.name}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCustomProperties(!showCustomProperties)}
              iconName="Settings"
              iconSize={14}
            >
              Properties
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowImportModal(true)}
              iconName="Upload"
              iconSize={14}
            >
              Import
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExportCSS}
              iconName="Download"
              iconSize={14}
            >
              Export
            </Button>
          </div>
        </div>

        {/* Framework Description */}
        <div className="mt-2">
          <p className="text-xs text-text-muted">
            {cssFrameworks.find(f => f.id === selectedFramework)?.description}
          </p>
        </div>
      </div>

      {/* Custom Properties Panel */}
      {showCustomProperties && (
        <div className="bg-surface-50 border-b border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-text-primary">Custom CSS Properties</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCustomProperties(false)}
              iconName="X"
              iconSize={14}
            />
          </div>
          
          {/* Add New Property */}
          <div className="flex items-center space-x-2 mb-3">
            <Input
              type="text"
              placeholder="Property name (e.g., --primary-color)"
              value={newProperty.name}
              onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
              className="flex-1"
            />
            <Input
              type="text"
              placeholder="Value (e.g., #3b82f6)"
              value={newProperty.value}
              onChange={(e) => setNewProperty({ ...newProperty, value: e.target.value })}
              className="flex-1"
            />
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddCustomProperty}
              iconName="Plus"
              iconSize={14}
            >
              Add
            </Button>
          </div>
          
          {/* Existing Properties */}
          <div className="space-y-2">
            {Object.entries(customProperties || {}).map(([name, value]) => (
              <div key={name} className="flex items-center justify-between p-2 bg-surface rounded border border-border">
                <div className="flex items-center space-x-2">
                  <code className="text-xs text-accent-600">{name}</code>
                  <span className="text-xs text-text-muted">:</span>
                  <code className="text-xs text-text-primary">{value}</code>
                </div>
                <button
                  onClick={() => handleRemoveCustomProperty(name)}
                  className="p-1 text-text-muted hover:text-error-500 transition-colors duration-200"
                >
                  <Icon name="Trash2" size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Template Selection */}
      <div className="bg-surface-50 border-b border-border p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Icon name="Zap" size={16} className="text-accent-500" />
          <h3 className="text-sm font-medium text-text-primary">Quick Templates</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {presetTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleTemplateSelect(template)}
              className="p-3 text-left bg-surface border border-border rounded-lg hover:border-primary-200 hover:bg-primary-50 transition-all duration-200 group"
            >
              <h4 className="text-sm font-medium text-text-primary group-hover:text-primary-700">
                {template.name}
              </h4>
              <p className="text-xs text-text-muted mt-1">
                {template.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-surface rounded-lg shadow-elevation-3 w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-text-primary">Import CSS</h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="p-1 text-text-muted hover:text-text-primary transition-colors duration-200"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Select CSS File
                </label>
                <input
                  type="file"
                  accept=".css"
                  onChange={handleImportCSS}
                  className="w-full px-3 py-2 border border-border rounded-md bg-surface text-text-primary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
              </div>
              
              <div className="text-xs text-text-muted">
                <p>• Supported formats: .css</p>
                <p>• File will be imported and merged with existing CSS</p>
                <p>• Large files may take a moment to process</p>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-2 p-4 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowImportModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CSSControlBar;