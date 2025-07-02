import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const SVGCanvas = ({ 
  elements = [], 
  selectedElement, 
  onElementSelect, 
  onElementUpdate, 
  onElementAdd,
  onElementDelete,
  currentLanguage = 'en' 
}) => {
  const canvasRef = useRef(null);
  const [canvasSettings, setCanvasSettings] = useState({
    zoom: 100,
    showGrid: true,
    snapToGrid: true,
    gridSize: 20
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setCanvasSize({ width: rect.width, height: rect.height });
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    try {
      const elementData = JSON.parse(e.dataTransfer.getData('application/json'));
      const newElement = {
        id: `${elementData.id}_${Date.now()}`,
        type: elementData.id,
        name: elementData.name,
        x: canvasSettings.snapToGrid ? Math.round(x / canvasSettings.gridSize) * canvasSettings.gridSize : x,
        y: canvasSettings.snapToGrid ? Math.round(y / canvasSettings.gridSize) * canvasSettings.gridSize : y,
        width: 100,
        height: 100,
        svg: elementData.svg,
        properties: {
          fill: '#3B82F6',
          stroke: '#1E40AF',
          strokeWidth: 2,
          opacity: 1,
          rotation: 0
        }
      };
      onElementAdd(newElement);
    } catch (error) {
      console.error('Failed to parse dropped element:', error);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleElementMouseDown = (e, element) => {
    e.stopPropagation();
    onElementSelect(element);
    setIsDragging(true);
    
    const rect = canvasRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left - element.x,
      y: e.clientY - rect.top - element.y
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging && selectedElement) {
      const rect = canvasRef.current.getBoundingClientRect();
      const newX = e.clientX - rect.left - dragOffset.x;
      const newY = e.clientY - rect.top - dragOffset.y;
      
      const updatedElement = {
        ...selectedElement,
        x: canvasSettings.snapToGrid ? Math.round(newX / canvasSettings.gridSize) * canvasSettings.gridSize : newX,
        y: canvasSettings.snapToGrid ? Math.round(newY / canvasSettings.gridSize) * canvasSettings.gridSize : newY
      };
      
      onElementUpdate(updatedElement);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCanvasClick = (e) => {
    if (e.target === canvasRef.current || e.target.closest('.canvas-background')) {
      onElementSelect(null);
    }
  };

  const handleZoomChange = (newZoom) => {
    setCanvasSettings(prev => ({ ...prev, zoom: Math.max(25, Math.min(400, newZoom)) }));
  };

  const toggleGrid = () => {
    setCanvasSettings(prev => ({ ...prev, showGrid: !prev.showGrid }));
  };

  const toggleSnapToGrid = () => {
    setCanvasSettings(prev => ({ ...prev, snapToGrid: !prev.snapToGrid }));
  };

  const handleKeyDown = (e) => {
    if (selectedElement) {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        onElementDelete(selectedElement.id);
      } else if (e.key === 'Escape') {
        onElementSelect(null);
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement]);

  const renderGridPattern = () => {
    if (!canvasSettings.showGrid) return null;
    
    const { gridSize } = canvasSettings;
    const lines = [];
    
    // Vertical lines
    for (let x = 0; x <= canvasSize.width; x += gridSize) {
      lines.push(
        <line
          key={`v-${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={canvasSize.height}
          stroke="#E2E8F0"
          strokeWidth="0.5"
        />
      );
    }
    
    // Horizontal lines
    for (let y = 0; y <= canvasSize.height; y += gridSize) {
      lines.push(
        <line
          key={`h-${y}`}
          x1={0}
          y1={y}
          x2={canvasSize.width}
          y2={y}
          stroke="#E2E8F0"
          strokeWidth="0.5"
        />
      );
    }
    
    return lines;
  };

  return (
    <div className="h-full bg-surface flex flex-col">
      {/* Canvas Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-surface-50">
        <div className="flex items-center space-x-4">
          {/* Zoom Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleZoomChange(canvasSettings.zoom - 25)}
              className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-surface rounded transition-colors duration-200"
              disabled={canvasSettings.zoom <= 25}
            >
              <Icon name="ZoomOut" size={16} />
            </button>
            <span className="text-sm font-medium text-text-primary min-w-[60px] text-center">
              {canvasSettings.zoom}%
            </span>
            <button
              onClick={() => handleZoomChange(canvasSettings.zoom + 25)}
              className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-surface rounded transition-colors duration-200"
              disabled={canvasSettings.zoom >= 400}
            >
              <Icon name="ZoomIn" size={16} />
            </button>
          </div>

          {/* Grid Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleGrid}
              className={`p-1.5 rounded transition-colors duration-200 ${
                canvasSettings.showGrid 
                  ? 'text-primary-600 bg-primary-50' :'text-text-secondary hover:text-text-primary hover:bg-surface'
              }`}
            >
              <Icon name="Grid3x3" size={16} />
            </button>
            <button
              onClick={toggleSnapToGrid}
              className={`p-1.5 rounded transition-colors duration-200 ${
                canvasSettings.snapToGrid 
                  ? 'text-primary-600 bg-primary-50' :'text-text-secondary hover:text-text-primary hover:bg-surface'
              }`}
            >
              <Icon name="Magnet" size={16} />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-text-muted">
            {elements.length} element{elements.length !== 1 ? 's' : ''}
          </span>
          {selectedElement && (
            <span className="text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded">
              {selectedElement.name} selected
            </span>
          )}
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 overflow-hidden relative">
        <div 
          className="w-full h-full overflow-auto"
          style={{ transform: `scale(${canvasSettings.zoom / 100})`, transformOrigin: 'top left' }}
        >
          <svg
            ref={canvasRef}
            width="100%"
            height="100%"
            viewBox={`0 0 ${canvasSize.width} ${canvasSize.height}`}
            className="canvas-background cursor-crosshair"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onClick={handleCanvasClick}
            style={{ minHeight: '600px' }}
          >
            {/* Grid Pattern */}
            {renderGridPattern()}

            {/* Canvas Background */}
            <rect
              width="100%"
              height="100%"
              fill="white"
              stroke="#E2E8F0"
              strokeWidth="1"
              className="canvas-background"
            />

            {/* Rendered Elements */}
            {elements.map((element) => (
              <g
                key={element.id}
                transform={`translate(${element.x}, ${element.y}) rotate(${element.properties?.rotation || 0})`}
                className={`cursor-move ${selectedElement?.id === element.id ? 'selected-element' : ''}`}
                onMouseDown={(e) => handleElementMouseDown(e, element)}
              >
                <g
                  dangerouslySetInnerHTML={{ __html: element.svg }}
                  style={{
                    opacity: element.properties?.opacity || 1,
                    fill: element.properties?.fill,
                    stroke: element.properties?.stroke,
                    strokeWidth: element.properties?.strokeWidth
                  }}
                />
                
                {/* Selection Indicator */}
                {selectedElement?.id === element.id && (
                  <rect
                    x="-5"
                    y="-5"
                    width={element.width + 10}
                    height={element.height + 10}
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    className="selection-outline"
                  />
                )}
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Canvas Status Bar */}
      <div className="flex items-center justify-between px-3 py-2 border-t border-border bg-surface-50 text-xs text-text-muted">
        <div className="flex items-center space-x-4">
          <span>Canvas: {canvasSize.width} × {canvasSize.height}</span>
          {selectedElement && (
            <span>
              Position: {Math.round(selectedElement.x)}, {Math.round(selectedElement.y)}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="MousePointer" size={12} />
          <span>Click to select • Drag to move • Del to delete</span>
        </div>
      </div>
    </div>
  );
};

export default SVGCanvas;