import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const SVGElementLibrary = ({ onElementDrag, currentLanguage = 'en' }) => {
  const [expandedCategories, setExpandedCategories] = useState(['basic']);
  const [searchTerm, setSearchTerm] = useState('');

  const svgElements = {
    basic: {
      name: "Basic Shapes",
      icon: "Square",
      elements: [
        { id: 'rect', name: 'Rectangle', icon: 'Square', svg: '<rect width="100" height="60" fill="#3B82F6" stroke="#1E40AF" stroke-width="2" rx="4"/>' },
        { id: 'circle', name: 'Circle', icon: 'Circle', svg: '<circle cx="50" cy="50" r="40" fill="#10B981" stroke="#047857" stroke-width="2"/>' },
        { id: 'ellipse', name: 'Ellipse', icon: 'Circle', svg: '<ellipse cx="60" cy="40" rx="50" ry="30" fill="#F59E0B" stroke="#D97706" stroke-width="2"/>' },
        { id: 'polygon', name: 'Triangle', icon: 'Triangle', svg: '<polygon points="50,10 90,80 10,80" fill="#EF4444" stroke="#DC2626" stroke-width="2"/>' },
        { id: 'line', name: 'Line', icon: 'Minus', svg: '<line x1="10" y1="50" x2="90" y2="50" stroke="#6B7280" stroke-width="3" stroke-linecap="round"/>' },
        { id: 'polyline', name: 'Path', icon: 'Zap', svg: '<polyline points="10,80 30,20 50,60 70,10 90,50" fill="none" stroke="#8B5CF6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' }
      ]
    },
    icons: {
      name: "Icons",
      icon: "Star",
      elements: [
        { id: 'star', name: 'Star', icon: 'Star', svg: '<polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="#F59E0B" stroke="#D97706" stroke-width="1"/>' },
        { id: 'heart', name: 'Heart', icon: 'Heart', svg: '<path d="M50,85 C50,85 20,60 20,40 C20,25 30,15 45,20 C50,10 50,10 55,20 C70,15 80,25 80,40 C80,60 50,85 50,85 Z" fill="#EF4444" stroke="#DC2626" stroke-width="2"/>' },
        { id: 'arrow', name: 'Arrow', icon: 'ArrowRight', svg: '<path d="M10,50 L70,50 M55,35 L70,50 L55,65" fill="none" stroke="#3B82F6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' },
        { id: 'check', name: 'Check', icon: 'Check', svg: '<path d="M20,50 L40,70 L80,30" fill="none" stroke="#10B981" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>' },
        { id: 'cross', name: 'Cross', icon: 'X', svg: '<path d="M25,25 L75,75 M75,25 L25,75" fill="none" stroke="#EF4444" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>' },
        { id: 'plus', name: 'Plus', icon: 'Plus', svg: '<path d="M50,20 L50,80 M20,50 L80,50" fill="none" stroke="#059669" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>' }
      ]
    },
    text: {
      name: "Text Elements",
      icon: "Type",
      elements: [
        { id: 'text', name: 'Text', icon: 'Type', svg: '<text x="50" y="50" text-anchor="middle" dominant-baseline="middle" font-family="Inter, sans-serif" font-size="16" fill="#1E293B">Sample Text</text>' },
        { id: 'heading', name: 'Heading', icon: 'Heading', svg: '<text x="50" y="50" text-anchor="middle" dominant-baseline="middle" font-family="Inter, sans-serif" font-size="24" font-weight="600" fill="#0F172A">Heading</text>' },
        { id: 'label', name: 'Label', icon: 'Tag', svg: '<rect x="10" y="35" width="80" height="30" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="1" rx="15"/><text x="50" y="50" text-anchor="middle" dominant-baseline="middle" font-family="Inter, sans-serif" font-size="12" fill="#475569">Label</text>' }
      ]
    },
    advanced: {
      name: "Advanced",
      icon: "Layers",
      elements: [
        { id: 'gradient-rect', name: 'Gradient Rectangle', icon: 'Square', svg: '<defs><linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" /><stop offset="100%" style="stop-color:#1E40AF;stop-opacity:1" /></linearGradient></defs><rect width="100" height="60" fill="url(#grad1)" rx="8"/>' },
        { id: 'pattern-circle', name: 'Pattern Circle', icon: 'Circle', svg: '<defs><pattern id="dots" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r="2" fill="#3B82F6"/></pattern></defs><circle cx="50" cy="50" r="40" fill="url(#dots)" stroke="#1E40AF" stroke-width="2"/>' },
        { id: 'shadow-rect', name: 'Shadow Rectangle', icon: 'Square', svg: '<defs><filter id="shadow"><feDropShadow dx="4" dy="4" stdDeviation="3" flood-color="#00000040"/></filter></defs><rect x="10" y="10" width="80" height="50" fill="#10B981" rx="6" filter="url(#shadow)"/>' }
      ]
    }
  };

  const toggleCategory = (categoryKey) => {
    setExpandedCategories(prev => 
      prev.includes(categoryKey) 
        ? prev.filter(key => key !== categoryKey)
        : [...prev, categoryKey]
    );
  };

  const handleDragStart = (e, element) => {
    e.dataTransfer.setData('application/json', JSON.stringify(element));
    e.dataTransfer.effectAllowed = 'copy';
    onElementDrag?.(element);
  };

  const filteredElements = Object.entries(svgElements).reduce((acc, [categoryKey, category]) => {
    const filtered = category.elements.filter(element =>
      element.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[categoryKey] = { ...category, elements: filtered };
    }
    return acc;
  }, {});

  return (
    <div className="h-full bg-surface border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-semibold text-text-primary mb-3">SVG Elements</h3>
        <div className="relative">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search elements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-surface-50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Elements List */}
      <div className="flex-1 overflow-y-auto">
        {Object.entries(filteredElements).map(([categoryKey, category]) => (
          <div key={categoryKey} className="border-b border-border last:border-b-0">
            <button
              onClick={() => toggleCategory(categoryKey)}
              className="w-full flex items-center justify-between p-3 text-left hover:bg-surface-50 transition-colors duration-200"
            >
              <div className="flex items-center space-x-2">
                <Icon name={category.icon} size={16} className="text-text-secondary" />
                <span className="text-sm font-medium text-text-primary">{category.name}</span>
                <span className="text-xs text-text-muted">({category.elements.length})</span>
              </div>
              <Icon 
                name="ChevronDown" 
                size={16} 
                className={`text-text-muted transition-transform duration-200 ${
                  expandedCategories.includes(categoryKey) ? 'rotate-180' : ''
                }`} 
              />
            </button>

            {expandedCategories.includes(categoryKey) && (
              <div className="pb-2">
                {category.elements.map((element) => (
                  <div
                    key={element.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, element)}
                    className="mx-3 mb-2 p-3 bg-surface-50 hover:bg-surface-100 border border-border rounded-md cursor-grab active:cursor-grabbing transition-colors duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white border border-border rounded flex items-center justify-center flex-shrink-0">
                        <svg width="40" height="40" viewBox="0 0 100 100" className="overflow-visible">
                          <g dangerouslySetInnerHTML={{ __html: element.svg }} />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <Icon name={element.icon} size={14} className="text-text-secondary flex-shrink-0" />
                          <span className="text-sm font-medium text-text-primary truncate">{element.name}</span>
                        </div>
                        <div className="flex items-center space-x-1 mt-1">
                          <Icon name="Move" size={12} className="text-text-muted" />
                          <span className="text-xs text-text-muted">Drag to canvas</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="p-3 border-t border-border bg-surface-50">
        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center space-x-1 px-2 py-1.5 text-xs text-text-secondary hover:text-text-primary hover:bg-surface transition-colors duration-200 rounded">
            <Icon name="Upload" size={12} />
            <span>Import</span>
          </button>
          <button className="flex items-center justify-center space-x-1 px-2 py-1.5 text-xs text-text-secondary hover:text-text-primary hover:bg-surface transition-colors duration-200 rounded">
            <Icon name="Bookmark" size={12} />
            <span>Favorites</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SVGElementLibrary;