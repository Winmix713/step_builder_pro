import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const PropertiesPanel = ({ 
  selectedElement, 
  onElementUpdate, 
  onElementDelete,
  currentLanguage = 'en' 
}) => {
  const [activeTab, setActiveTab] = useState('appearance');
  const [localProperties, setLocalProperties] = useState({});

  useEffect(() => {
    if (selectedElement) {
      setLocalProperties({
        ...selectedElement.properties,
        x: selectedElement.x,
        y: selectedElement.y,
        width: selectedElement.width,
        height: selectedElement.height,
        name: selectedElement.name
      });
    }
  }, [selectedElement]);

  const handlePropertyChange = (property, value) => {
    const newProperties = { ...localProperties, [property]: value };
    setLocalProperties(newProperties);
    
    if (selectedElement) {
      const updatedElement = {
        ...selectedElement,
        properties: {
          ...selectedElement.properties,
          [property]: value
        }
      };
      
      // Handle position and size updates
      if (property === 'x' || property === 'y') {
        updatedElement[property] = parseFloat(value) || 0;
      } else if (property === 'width' || property === 'height') {
        updatedElement[property] = parseFloat(value) || 1;
      } else if (property === 'name') {
        updatedElement.name = value;
      }
      
      onElementUpdate(updatedElement);
    }
  };

  const handleColorChange = (property, color) => {
    handlePropertyChange(property, color);
  };

  const predefinedColors = [
    '#3B82F6', '#1E40AF', '#10B981', '#047857', '#F59E0B', '#D97706',
    '#EF4444', '#DC2626', '#8B5CF6', '#7C3AED', '#EC4899', '#BE185D',
    '#6B7280', '#374151', '#000000', '#FFFFFF'
  ];

  const tabs = [
    { id: 'appearance', name: 'Appearance', icon: 'Palette' },
    { id: 'position', name: 'Position', icon: 'Move' },
    { id: 'effects', name: 'Effects', icon: 'Sparkles' }
  ];

  if (!selectedElement) {
    return (
      <div className="h-full bg-surface border-l border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold text-text-primary">Properties</h3>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Icon name="MousePointer" size={48} className="text-text-muted mx-auto mb-3" />
            <p className="text-sm text-text-muted">Select an element to edit properties</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-surface border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-text-primary">Properties</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onElementDelete(selectedElement.id)}
            iconName="Trash2"
            iconSize={14}
            className="text-error-600 hover:text-error-700 hover:bg-error-50"
          />
        </div>
        
        {/* Element Info */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-8 h-8 bg-surface-50 border border-border rounded flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 100 100">
              <g dangerouslySetInnerHTML={{ __html: selectedElement.svg }} />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <Input
              type="text"
              value={localProperties.name || ''}
              onChange={(e) => handlePropertyChange('name', e.target.value)}
              className="text-sm font-medium"
              placeholder="Element name"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-1 px-2 py-1.5 text-xs rounded transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'bg-primary-100 text-primary-700' :'text-text-secondary hover:text-text-primary hover:bg-surface-50'
              }`}
            >
              <Icon name={tab.icon} size={12} />
              <span className="hidden sm:inline">{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'appearance' && (
          <>
            {/* Fill Color */}
            <div>
              <label className="block text-xs font-medium text-text-primary mb-2">Fill Color</label>
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="color"
                  value={localProperties.fill || '#3B82F6'}
                  onChange={(e) => handleColorChange('fill', e.target.value)}
                  className="w-8 h-8 rounded border border-border cursor-pointer"
                />
                <Input
                  type="text"
                  value={localProperties.fill || '#3B82F6'}
                  onChange={(e) => handleColorChange('fill', e.target.value)}
                  className="flex-1 text-xs font-mono"
                  placeholder="#3B82F6"
                />
              </div>
              <div className="grid grid-cols-8 gap-1">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange('fill', color)}
                    className={`w-6 h-6 rounded border-2 transition-all duration-200 ${
                      localProperties.fill === color ? 'border-text-primary scale-110' : 'border-border hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Stroke Color */}
            <div>
              <label className="block text-xs font-medium text-text-primary mb-2">Stroke Color</label>
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="color"
                  value={localProperties.stroke || '#1E40AF'}
                  onChange={(e) => handleColorChange('stroke', e.target.value)}
                  className="w-8 h-8 rounded border border-border cursor-pointer"
                />
                <Input
                  type="text"
                  value={localProperties.stroke || '#1E40AF'}
                  onChange={(e) => handleColorChange('stroke', e.target.value)}
                  className="flex-1 text-xs font-mono"
                  placeholder="#1E40AF"
                />
              </div>
            </div>

            {/* Stroke Width */}
            <div>
              <label className="block text-xs font-medium text-text-primary mb-2">Stroke Width</label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="0.5"
                  value={localProperties.strokeWidth || 2}
                  onChange={(e) => handlePropertyChange('strokeWidth', parseFloat(e.target.value))}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={localProperties.strokeWidth || 2}
                  onChange={(e) => handlePropertyChange('strokeWidth', parseFloat(e.target.value))}
                  className="w-16 text-xs"
                  min="0"
                  max="20"
                  step="0.5"
                />
              </div>
            </div>

            {/* Opacity */}
            <div>
              <label className="block text-xs font-medium text-text-primary mb-2">Opacity</label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={localProperties.opacity || 1}
                  onChange={(e) => handlePropertyChange('opacity', parseFloat(e.target.value))}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={Math.round((localProperties.opacity || 1) * 100)}
                  onChange={(e) => handlePropertyChange('opacity', parseFloat(e.target.value) / 100)}
                  className="w-16 text-xs"
                  min="0"
                  max="100"
                />
                <span className="text-xs text-text-muted">%</span>
              </div>
            </div>
          </>
        )}

        {activeTab === 'position' && (
          <>
            {/* Position */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-text-primary mb-1">X Position</label>
                <Input
                  type="number"
                  value={Math.round(localProperties.x || 0)}
                  onChange={(e) => handlePropertyChange('x', parseFloat(e.target.value))}
                  className="text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-primary mb-1">Y Position</label>
                <Input
                  type="number"
                  value={Math.round(localProperties.y || 0)}
                  onChange={(e) => handlePropertyChange('y', parseFloat(e.target.value))}
                  className="text-xs"
                />
              </div>
            </div>

            {/* Size */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-text-primary mb-1">Width</label>
                <Input
                  type="number"
                  value={Math.round(localProperties.width || 100)}
                  onChange={(e) => handlePropertyChange('width', parseFloat(e.target.value))}
                  className="text-xs"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-primary mb-1">Height</label>
                <Input
                  type="number"
                  value={Math.round(localProperties.height || 100)}
                  onChange={(e) => handlePropertyChange('height', parseFloat(e.target.value))}
                  className="text-xs"
                  min="1"
                />
              </div>
            </div>

            {/* Rotation */}
            <div>
              <label className="block text-xs font-medium text-text-primary mb-2">Rotation</label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="1"
                  value={localProperties.rotation || 0}
                  onChange={(e) => handlePropertyChange('rotation', parseFloat(e.target.value))}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={localProperties.rotation || 0}
                  onChange={(e) => handlePropertyChange('rotation', parseFloat(e.target.value))}
                  className="w-16 text-xs"
                  min="0"
                  max="360"
                />
                <span className="text-xs text-text-muted">°</span>
              </div>
            </div>

            {/* Quick Position Actions */}
            <div>
              <label className="block text-xs font-medium text-text-primary mb-2">Quick Actions</label>
              <div className="grid grid-cols-3 gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    handlePropertyChange('x', 0);
                    handlePropertyChange('y', 0);
                  }}
                  className="text-xs"
                >
                  Top Left
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    handlePropertyChange('x', 400);
                    handlePropertyChange('y', 0);
                  }}
                  className="text-xs"
                >
                  Top Center
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    handlePropertyChange('x', 400);
                    handlePropertyChange('y', 300);
                  }}
                  className="text-xs"
                >
                  Center
                </Button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'effects' && (
          <>
            {/* Shadow */}
            <div>
              <label className="block text-xs font-medium text-text-primary mb-2">Drop Shadow</label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={localProperties.hasShadow || false}
                    onChange={(e) => handlePropertyChange('hasShadow', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-xs text-text-secondary">Enable shadow</span>
                </div>
                {localProperties.hasShadow && (
                  <div className="space-y-2 pl-6">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-text-muted mb-1">Offset X</label>
                        <Input
                          type="number"
                          value={localProperties.shadowX || 4}
                          onChange={(e) => handlePropertyChange('shadowX', parseFloat(e.target.value))}
                          className="text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-text-muted mb-1">Offset Y</label>
                        <Input
                          type="number"
                          value={localProperties.shadowY || 4}
                          onChange={(e) => handlePropertyChange('shadowY', parseFloat(e.target.value))}
                          className="text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-text-muted mb-1">Blur</label>
                      <Input
                        type="number"
                        value={localProperties.shadowBlur || 3}
                        onChange={(e) => handlePropertyChange('shadowBlur', parseFloat(e.target.value))}
                        className="text-xs"
                        min="0"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Border Radius */}
            <div>
              <label className="block text-xs font-medium text-text-primary mb-2">Border Radius</label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={localProperties.borderRadius || 0}
                  onChange={(e) => handlePropertyChange('borderRadius', parseFloat(e.target.value))}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={localProperties.borderRadius || 0}
                  onChange={(e) => handlePropertyChange('borderRadius', parseFloat(e.target.value))}
                  className="w-16 text-xs"
                  min="0"
                  max="50"
                />
                <span className="text-xs text-text-muted">px</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-border space-y-2">
        <Button
          variant="primary"
          size="sm"
          className="w-full"
          iconName="Copy"
          iconSize={14}
        >
          Duplicate Element
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="RotateCcw"
            iconSize={14}
          >
            Reset
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="Download"
            iconSize={14}
          >
            Export
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;