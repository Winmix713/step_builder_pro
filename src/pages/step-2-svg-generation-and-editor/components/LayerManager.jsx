import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LayerManager = ({ 
  elements = [], 
  selectedElement, 
  onElementSelect, 
  onElementUpdate,
  onElementDelete,
  onLayerReorder,
  currentLanguage = 'en' 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [draggedElement, setDraggedElement] = useState(null);

  const handleLayerClick = (element) => {
    onElementSelect(element);
  };

  const handleVisibilityToggle = (element) => {
    const updatedElement = {
      ...element,
      properties: {
        ...element.properties,
        visible: !element.properties?.visible
      }
    };
    onElementUpdate(updatedElement);
  };

  const handleLockToggle = (element) => {
    const updatedElement = {
      ...element,
      properties: {
        ...element.properties,
        locked: !element.properties?.locked
      }
    };
    onElementUpdate(updatedElement);
  };

  const handleDragStart = (e, element) => {
    setDraggedElement(element);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetElement) => {
    e.preventDefault();
    if (draggedElement && draggedElement.id !== targetElement.id) {
      onLayerReorder(draggedElement.id, targetElement.id);
    }
    setDraggedElement(null);
  };

  const getLayerIcon = (element) => {
    const iconMap = {
      rect: 'Square',
      circle: 'Circle',
      ellipse: 'Circle',
      polygon: 'Triangle',
      line: 'Minus',
      polyline: 'Zap',
      text: 'Type',
      star: 'Star',
      heart: 'Heart',
      arrow: 'ArrowRight',
      check: 'Check',
      cross: 'X',
      plus: 'Plus'
    };
    return iconMap[element.type] || 'Square';
  };

  if (isCollapsed) {
    return (
      <div className="w-8 bg-surface border-l border-border flex flex-col">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface-50 transition-colors duration-200"
          title="Expand Layers"
        >
          <Icon name="ChevronRight" size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="w-64 bg-surface border-l border-border flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <h3 className="text-sm font-semibold text-text-primary">Layers</h3>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            iconName="Plus"
            iconSize={14}
            className="tooltip-trigger"
            title="Add Layer"
          />
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1 text-text-secondary hover:text-text-primary hover:bg-surface-50 rounded transition-colors duration-200"
            title="Collapse Layers"
          >
            <Icon name="ChevronLeft" size={14} />
          </button>
        </div>
      </div>

      {/* Layers List */}
      <div className="flex-1 overflow-y-auto">
        {elements.length === 0 ? (
          <div className="p-4 text-center">
            <Icon name="Layers" size={32} className="text-text-muted mx-auto mb-2" />
            <p className="text-sm text-text-muted">No layers yet</p>
            <p className="text-xs text-text-muted mt-1">Drag elements from the library to create layers</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {elements.slice().reverse().map((element, index) => (
              <div
                key={element.id}
                draggable
                onDragStart={(e) => handleDragStart(e, element)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, element)}
                className={`group flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-all duration-200 ${
                  selectedElement?.id === element.id
                    ? 'bg-primary-50 border border-primary-200' :'hover:bg-surface-50 border border-transparent'
                } ${draggedElement?.id === element.id ? 'opacity-50' : ''}`}
                onClick={() => handleLayerClick(element)}
              >
                {/* Drag Handle */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Icon name="GripVertical" size={12} className="text-text-muted cursor-grab" />
                </div>

                {/* Layer Icon */}
                <div className="w-6 h-6 bg-surface-50 border border-border rounded flex items-center justify-center flex-shrink-0">
                  <Icon name={getLayerIcon(element)} size={12} className="text-text-secondary" />
                </div>

                {/* Layer Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-1">
                    <span className={`text-sm truncate ${
                      selectedElement?.id === element.id ? 'text-primary-700 font-medium' : 'text-text-primary'
                    }`}>
                      {element.name}
                    </span>
                    {element.properties?.locked && (
                      <Icon name="Lock" size={10} className="text-warning-500 flex-shrink-0" />
                    )}
                  </div>
                  <div className="text-xs text-text-muted">
                    {Math.round(element.x)}, {Math.round(element.y)}
                  </div>
                </div>

                {/* Layer Controls */}
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVisibilityToggle(element);
                    }}
                    className="p-1 text-text-muted hover:text-text-primary rounded transition-colors duration-200"
                    title={element.properties?.visible === false ? 'Show' : 'Hide'}
                  >
                    <Icon 
                      name={element.properties?.visible === false ? 'EyeOff' : 'Eye'} 
                      size={12} 
                    />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLockToggle(element);
                    }}
                    className="p-1 text-text-muted hover:text-text-primary rounded transition-colors duration-200"
                    title={element.properties?.locked ? 'Unlock' : 'Lock'}
                  >
                    <Icon 
                      name={element.properties?.locked ? 'Lock' : 'Unlock'} 
                      size={12} 
                    />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onElementDelete(element.id);
                    }}
                    className="p-1 text-error-500 hover:text-error-600 rounded transition-colors duration-200"
                    title="Delete Layer"
                  >
                    <Icon name="Trash2" size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Layer Actions */}
      <div className="p-3 border-t border-border bg-surface-50">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="Copy"
            iconSize={12}
            disabled={!selectedElement}
            className="text-xs"
          >
            Duplicate
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="Group"
            iconSize={12}
            disabled={!selectedElement}
            className="text-xs"
          >
            Group
          </Button>
        </div>
        
        {/* Layer Stats */}
        <div className="mt-2 text-xs text-text-muted text-center">
          {elements.length} layer{elements.length !== 1 ? 's' : ''}
          {selectedElement && (
            <span className="text-primary-600"> • {selectedElement.name} selected</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default LayerManager;