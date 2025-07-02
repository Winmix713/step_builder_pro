import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import StepProgressHeader from '../../components/ui/StepProgressHeader';
import StepNavigationControls from '../../components/ui/StepNavigationControls';

import SVGElementLibrary from './components/SVGElementLibrary';
import SVGCanvas from './components/SVGCanvas';
import PropertiesPanel from './components/PropertiesPanel';
import EditingToolbar from './components/EditingToolbar';
import LayerManager from './components/LayerManager';
import ExportModal from './components/ExportModal';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const SVGGenerationAndEditor = () => {
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState('en');
  
  // Editor State
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  
  // UI State
  const [leftPanelWidth, setLeftPanelWidth] = useState(15);
  const [rightPanelWidth, setRightPanelWidth] = useState(20);
  const [showLayerManager, setShowLayerManager] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [mobileActivePanel, setMobileActivePanel] = useState('canvas');

  // Load language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('stepBuilderPro_language');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  // Load saved project data
  useEffect(() => {
    const savedElements = localStorage.getItem('stepBuilderPro_svgElements');
    if (savedElements) {
      try {
        const parsedElements = JSON.parse(savedElements);
        setElements(parsedElements);
        addToHistory(parsedElements);
      } catch (error) {
        console.error('Failed to load saved elements:', error);
      }
    }
  }, []);

  // Auto-save elements
  useEffect(() => {
    if (elements.length > 0) {
      localStorage.setItem('stepBuilderPro_svgElements', JSON.stringify(elements));
    }
  }, [elements]);

  // Handle responsive design
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setIsMobileView(isMobile);
      
      if (isMobile) {
        setShowLayerManager(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // History management
  const addToHistory = useCallback((newElements) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(JSON.parse(JSON.stringify(newElements)));
      return newHistory.slice(-50); // Keep last 50 states
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [historyIndex]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setElements(JSON.parse(JSON.stringify(history[newIndex])));
      setSelectedElement(null);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setElements(JSON.parse(JSON.stringify(history[newIndex])));
      setSelectedElement(null);
    }
  };

  // Element management
  const handleElementAdd = (newElement) => {
    const updatedElements = [...elements, newElement];
    setElements(updatedElements);
    setSelectedElement(newElement);
    addToHistory(updatedElements);
  };

  const handleElementUpdate = (updatedElement) => {
    const updatedElements = elements.map(el => 
      el.id === updatedElement.id ? updatedElement : el
    );
    setElements(updatedElements);
    setSelectedElement(updatedElement);
  };

  const handleElementDelete = (elementId) => {
    const updatedElements = elements.filter(el => el.id !== elementId);
    setElements(updatedElements);
    setSelectedElement(null);
    addToHistory(updatedElements);
  };

  const handleElementSelect = (element) => {
    setSelectedElement(element);
  };

  // Group operations
  const handleGroup = () => {
    if (selectedElement) {
      // Group logic would go here
      console.log('Group selected elements');
    }
  };

  const handleUngroup = () => {
    if (selectedElement) {
      // Ungroup logic would go here
      console.log('Ungroup selected elements');
    }
  };

  // Alignment operations
  const handleAlign = (alignment) => {
    if (selectedElement) {
      let updatedElement = { ...selectedElement };
      
      switch (alignment) {
        case 'left':
          updatedElement.x = 0;
          break;
        case 'center':
          updatedElement.x = 400 - (updatedElement.width / 2);
          break;
        case 'right':
          updatedElement.x = 800 - updatedElement.width;
          break;
        case 'top':
          updatedElement.y = 0;
          break;
        case 'middle':
          updatedElement.y = 300 - (updatedElement.height / 2);
          break;
        case 'bottom':
          updatedElement.y = 600 - updatedElement.height;
          break;
      }
      
      handleElementUpdate(updatedElement);
    }
  };

  // Layer operations
  const handleLayer = (layerAction) => {
    if (selectedElement) {
      const currentIndex = elements.findIndex(el => el.id === selectedElement.id);
      let newIndex = currentIndex;
      
      switch (layerAction) {
        case 'front':
          newIndex = elements.length - 1;
          break;
        case 'forward':
          newIndex = Math.min(currentIndex + 1, elements.length - 1);
          break;
        case 'backward':
          newIndex = Math.max(currentIndex - 1, 0);
          break;
        case 'back':
          newIndex = 0;
          break;
      }
      
      if (newIndex !== currentIndex) {
        const updatedElements = [...elements];
        const [movedElement] = updatedElements.splice(currentIndex, 1);
        updatedElements.splice(newIndex, 0, movedElement);
        setElements(updatedElements);
        addToHistory(updatedElements);
      }
    }
  };

  const handleLayerReorder = (draggedId, targetId) => {
    const draggedIndex = elements.findIndex(el => el.id === draggedId);
    const targetIndex = elements.findIndex(el => el.id === targetId);
    
    if (draggedIndex !== -1 && targetIndex !== -1) {
      const updatedElements = [...elements];
      const [draggedElement] = updatedElements.splice(draggedIndex, 1);
      updatedElements.splice(targetIndex, 0, draggedElement);
      setElements(updatedElements);
      addToHistory(updatedElements);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              handleRedo();
            } else {
              handleUndo();
            }
            break;
          case 'y':
            e.preventDefault();
            handleRedo();
            break;
          case 'g':
            e.preventDefault();
            if (e.shiftKey) {
              handleUngroup();
            } else {
              handleGroup();
            }
            break;
          case 'e':
            e.preventDefault();
            setIsExportModalOpen(true);
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement, historyIndex]);

  // Mobile panel rendering
  const renderMobilePanel = () => {
    switch (mobileActivePanel) {
      case 'library':
        return (
          <SVGElementLibrary
            onElementDrag={handleElementAdd}
            currentLanguage={currentLanguage}
          />
        );
      case 'properties':
        return (
          <PropertiesPanel
            selectedElement={selectedElement}
            onElementUpdate={handleElementUpdate}
            onElementDelete={handleElementDelete}
            currentLanguage={currentLanguage}
          />
        );
      case 'layers':
        return (
          <LayerManager
            elements={elements}
            selectedElement={selectedElement}
            onElementSelect={handleElementSelect}
            onElementUpdate={handleElementUpdate}
            onElementDelete={handleElementDelete}
            onLayerReorder={handleLayerReorder}
            currentLanguage={currentLanguage}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <StepProgressHeader />
      
      <div className="pt-16 md:pt-20 h-screen flex flex-col">
        {/* Desktop Layout */}
        {!isMobileView ? (
          <>
            {/* Editing Toolbar */}
            <EditingToolbar
              onUndo={handleUndo}
              onRedo={handleRedo}
              onGroup={handleGroup}
              onUngroup={handleUngroup}
              onAlign={handleAlign}
              onLayer={handleLayer}
              canUndo={historyIndex > 0}
              canRedo={historyIndex < history.length - 1}
              hasSelection={!!selectedElement}
              currentLanguage={currentLanguage}
            />

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Panel - Element Library */}
              <div style={{ width: `${leftPanelWidth}%` }} className="min-w-[200px]">
                <SVGElementLibrary
                  onElementDrag={handleElementAdd}
                  currentLanguage={currentLanguage}
                />
              </div>

              {/* Center Panel - Canvas */}
              <div style={{ width: `${100 - leftPanelWidth - rightPanelWidth - (showLayerManager ? 15 : 0)}%` }} className="min-w-[400px]">
                <SVGCanvas
                  elements={elements}
                  selectedElement={selectedElement}
                  onElementSelect={handleElementSelect}
                  onElementUpdate={handleElementUpdate}
                  onElementAdd={handleElementAdd}
                  onElementDelete={handleElementDelete}
                  currentLanguage={currentLanguage}
                />
              </div>

              {/* Layer Manager (Optional) */}
              {showLayerManager && (
                <LayerManager
                  elements={elements}
                  selectedElement={selectedElement}
                  onElementSelect={handleElementSelect}
                  onElementUpdate={handleElementUpdate}
                  onElementDelete={handleElementDelete}
                  onLayerReorder={handleLayerReorder}
                  currentLanguage={currentLanguage}
                />
              )}

              {/* Right Panel - Properties */}
              <div style={{ width: `${rightPanelWidth}%` }} className="min-w-[250px]">
                <PropertiesPanel
                  selectedElement={selectedElement}
                  onElementUpdate={handleElementUpdate}
                  onElementDelete={handleElementDelete}
                  currentLanguage={currentLanguage}
                />
              </div>
            </div>
          </>
        ) : (
          /* Mobile Layout */
          <>
            {/* Mobile Toolbar */}
            <div className="flex items-center justify-between p-3 bg-surface border-b border-border">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                  iconName="Undo"
                  iconSize={16}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                  iconName="Redo"
                  iconSize={16}
                />
              </div>
              
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExportModalOpen(true)}
                  iconName="Download"
                  iconSize={16}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowLayerManager(!showLayerManager)}
                  iconName="Layers"
                  iconSize={16}
                />
              </div>
            </div>

            {/* Mobile Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {mobileActivePanel === 'canvas' ? (
                <SVGCanvas
                  elements={elements}
                  selectedElement={selectedElement}
                  onElementSelect={handleElementSelect}
                  onElementUpdate={handleElementUpdate}
                  onElementAdd={handleElementAdd}
                  onElementDelete={handleElementDelete}
                  currentLanguage={currentLanguage}
                />
              ) : (
                <div className="flex-1 overflow-hidden">
                  {renderMobilePanel()}
                </div>
              )}
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="flex bg-surface border-t border-border">
              {[
                { id: 'library', name: 'Library', icon: 'Shapes' },
                { id: 'canvas', name: 'Canvas', icon: 'Square' },
                { id: 'properties', name: 'Properties', icon: 'Settings' },
                { id: 'layers', name: 'Layers', icon: 'Layers' }
              ].map((panel) => (
                <button
                  key={panel.id}
                  onClick={() => setMobileActivePanel(panel.id)}
                  className={`flex-1 flex flex-col items-center justify-center py-3 transition-colors duration-200 ${
                    mobileActivePanel === panel.id
                      ? 'text-primary-600 bg-primary-50' :'text-text-secondary hover:text-text-primary hover:bg-surface-50'
                  }`}
                >
                  <Icon name={panel.icon} size={20} />
                  <span className="text-xs mt-1">{panel.name}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Floating Action Button - Toggle Layer Manager (Desktop) */}
      {!isMobileView && (
        <button
          onClick={() => setShowLayerManager(!showLayerManager)}
          className={`fixed bottom-24 left-4 w-12 h-12 rounded-full shadow-elevation-2 flex items-center justify-center transition-all duration-300 z-30 ${
            showLayerManager 
              ? 'bg-primary-500 text-white hover:bg-primary-600' :'bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-50'
          }`}
          title={showLayerManager ? 'Hide Layers' : 'Show Layers'}
        >
          <Icon name="Layers" size={20} />
        </button>
      )}

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        elements={elements}
        canvasSize={{ width: 800, height: 600 }}
        currentLanguage={currentLanguage}
      />

      <StepNavigationControls />
    </div>
  );
};

export default SVGGenerationAndEditor;