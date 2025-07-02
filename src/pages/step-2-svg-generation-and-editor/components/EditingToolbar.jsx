import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EditingToolbar = ({ 
  onUndo, 
  onRedo, 
  onGroup, 
  onUngroup, 
  onAlign, 
  onLayer,
  canUndo = false,
  canRedo = false,
  hasSelection = false,
  currentLanguage = 'en' 
}) => {
  const [activeAlignMenu, setActiveAlignMenu] = useState(false);
  const [activeLayerMenu, setActiveLayerMenu] = useState(false);

  const alignmentOptions = [
    { id: 'left', name: 'Align Left', icon: 'AlignLeft' },
    { id: 'center', name: 'Align Center', icon: 'AlignCenter' },
    { id: 'right', name: 'Align Right', icon: 'AlignRight' },
    { id: 'top', name: 'Align Top', icon: 'AlignVerticalJustifyStart' },
    { id: 'middle', name: 'Align Middle', icon: 'AlignVerticalJustifyCenter' },
    { id: 'bottom', name: 'Align Bottom', icon: 'AlignVerticalJustifyEnd' }
  ];

  const layerOptions = [
    { id: 'front', name: 'Bring to Front', icon: 'BringToFront' },
    { id: 'forward', name: 'Bring Forward', icon: 'ChevronUp' },
    { id: 'backward', name: 'Send Backward', icon: 'ChevronDown' },
    { id: 'back', name: 'Send to Back', icon: 'SendToBack' }
  ];

  const handleAlign = (alignment) => {
    onAlign(alignment);
    setActiveAlignMenu(false);
  };

  const handleLayer = (layerAction) => {
    onLayer(layerAction);
    setActiveLayerMenu(false);
  };

  return (
    <div className="flex items-center justify-between p-3 bg-surface border-b border-border">
      {/* Left Section - History */}
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
          iconName="Undo"
          iconSize={16}
          className="tooltip-trigger"
          title="Undo (Ctrl+Z)"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo}
          iconName="Redo"
          iconSize={16}
          className="tooltip-trigger"
          title="Redo (Ctrl+Y)"
        />
        <div className="w-px h-6 bg-border mx-1" />
      </div>

      {/* Center Section - Selection Tools */}
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onGroup}
          disabled={!hasSelection}
          iconName="Group"
          iconSize={16}
          className="tooltip-trigger"
          title="Group Selection (Ctrl+G)"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={onUngroup}
          disabled={!hasSelection}
          iconName="Ungroup"
          iconSize={16}
          className="tooltip-trigger"
          title="Ungroup Selection (Ctrl+Shift+G)"
        />
        
        <div className="w-px h-6 bg-border mx-1" />

        {/* Alignment Dropdown */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveAlignMenu(!activeAlignMenu)}
            disabled={!hasSelection}
            iconName="AlignCenter"
            iconSize={16}
            className="tooltip-trigger"
            title="Alignment Options"
          />
          {activeAlignMenu && (
            <div className="absolute top-full left-0 mt-1 bg-surface border border-border rounded-lg shadow-elevation-2 z-50 min-w-[160px]">
              <div className="p-1">
                {alignmentOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAlign(option.id)}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-text-primary hover:bg-surface-50 rounded transition-colors duration-200"
                  >
                    <Icon name={option.icon} size={16} className="text-text-secondary" />
                    <span>{option.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Layer Management Dropdown */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveLayerMenu(!activeLayerMenu)}
            disabled={!hasSelection}
            iconName="Layers"
            iconSize={16}
            className="tooltip-trigger"
            title="Layer Options"
          />
          {activeLayerMenu && (
            <div className="absolute top-full left-0 mt-1 bg-surface border border-border rounded-lg shadow-elevation-2 z-50 min-w-[160px]">
              <div className="p-1">
                {layerOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleLayer(option.id)}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-text-primary hover:bg-surface-50 rounded transition-colors duration-200"
                  >
                    <Icon name={option.icon} size={16} className="text-text-secondary" />
                    <span>{option.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Section - Export & Settings */}
      <div className="flex items-center space-x-2">
        <div className="w-px h-6 bg-border mx-1" />
        <Button
          variant="ghost"
          size="sm"
          iconName="Download"
          iconSize={16}
          className="tooltip-trigger"
          title="Export SVG"
        >
          Export
        </Button>
        <Button
          variant="ghost"
          size="sm"
          iconName="Settings"
          iconSize={16}
          className="tooltip-trigger"
          title="Canvas Settings"
        />
      </div>

      {/* Keyboard Shortcuts Overlay */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-surface-50 border border-border rounded-md px-3 py-1 text-xs text-text-muted z-30 hidden lg:block">
        <div className="flex items-center space-x-4">
          <span><kbd className="font-mono bg-surface px-1 rounded">Ctrl+Z</kbd> Undo</span>
          <span><kbd className="font-mono bg-surface px-1 rounded">Ctrl+Y</kbd> Redo</span>
          <span><kbd className="font-mono bg-surface px-1 rounded">Ctrl+G</kbd> Group</span>
          <span><kbd className="font-mono bg-surface px-1 rounded">Del</kbd> Delete</span>
        </div>
      </div>
    </div>
  );
};

export default EditingToolbar;