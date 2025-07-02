import React, { useState, useEffect, useRef } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const LivePreview = ({ cssCode, selectedFramework }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const iframeRef = useRef(null);

  const deviceModes = [
    { id: 'desktop', name: 'Desktop', width: '100%', height: '100%', icon: 'Monitor' },
    { id: 'tablet', name: 'Tablet', width: '768px', height: '1024px', icon: 'Tablet' },
    { id: 'mobile', name: 'Mobile', width: '375px', height: '667px', icon: 'Smartphone' }
  ];

  const sampleHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSS Preview</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f8fafc;
            padding: 2rem;
        }
        
        .preview-container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .demo-section {
            background: white;
            border-radius: 8px;
            padding: 2rem;
            margin-bottom: 2rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .demo-section h2 {
            margin-bottom: 1rem;
            color: #1f2937;
        }
        
        .demo-buttons {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
            flex-wrap: wrap;
        }
        
        .demo-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        }
        
        .demo-card {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 1.5rem;
            transition: transform 0.2s ease;
        }
        
        .demo-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .demo-form {
            max-width: 400px;
        }
        
        .form-group {
            margin-bottom: 1rem;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
        }
        
        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            font-size: 1rem;
        }
        
        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        /* User's custom CSS will be injected here */
        ${cssCode || ''}
    </style>
</head>
<body>
    <div class="preview-container">
        <div class="demo-section">
            <h2>Button Components</h2>
            <div class="demo-buttons">
                <button class="btn">Primary Button</button>
                <button class="btn btn-secondary">Secondary Button</button>
                <button class="btn btn-outline">Outline Button</button>
                <button class="btn btn-small">Small Button</button>
            </div>
        </div>
        
        <div class="demo-section">
            <h2>Card Components</h2>
            <div class="demo-cards">
                <div class="card">
                    <h3>Card Title</h3>
                    <p>This is a sample card component with some content to demonstrate styling.</p>
                    <button class="btn">Action</button>
                </div>
                <div class="card">
                    <h3>Another Card</h3>
                    <p>Cards are flexible components that can contain various types of content.</p>
                    <button class="btn">Learn More</button>
                </div>
                <div class="card">
                    <h3>Third Card</h3>
                    <p>You can style these cards using your custom CSS to match your design.</p>
                    <button class="btn">Get Started</button>
                </div>
            </div>
        </div>
        
        <div class="demo-section">
            <h2>Form Components</h2>
            <form class="demo-form">
                <div class="form-group">
                    <label for="name">Full Name</label>
                    <input type="text" id="name" placeholder="Enter your name">
                </div>
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input type="email" id="email" placeholder="Enter your email">
                </div>
                <div class="form-group">
                    <label for="message">Message</label>
                    <textarea id="message" rows="4" placeholder="Enter your message"></textarea>
                </div>
                <button type="submit" class="btn">Submit Form</button>
            </form>
        </div>
        
        <div class="demo-section">
            <h2>Typography & Text</h2>
            <h1 class="responsive-text">Heading 1</h1>
            <h2>Heading 2</h2>
            <h3>Heading 3</h3>
            <p>This is a paragraph of text to demonstrate typography styling. You can customize fonts, sizes, colors, and spacing using your CSS.</p>
            <p><strong>Bold text</strong> and <em>italic text</em> examples.</p>
        </div>
        
        <div class="demo-section">
            <h2>Layout Examples</h2>
            <div class="flex-container">
                <div class="flex-item">Flex Item 1</div>
                <div class="flex-item">Flex Item 2</div>
                <div class="flex-item">Flex Item 3</div>
            </div>
            
            <div class="grid-container" style="margin-top: 2rem;">
                <div class="grid-item">Grid Item 1</div>
                <div class="grid-item">Grid Item 2</div>
                <div class="grid-item">Grid Item 3</div>
                <div class="grid-item">Grid Item 4</div>
            </div>
        </div>
    </div>
</body>
</html>`;

  useEffect(() => {
    const savedLanguage = localStorage.getItem('stepBuilderPro_language');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    updatePreview();
  }, [cssCode, selectedFramework]);

  const updatePreview = () => {
    if (!iframeRef.current) return;
    
    setIsRefreshing(true);
    
    try {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      doc.open();
      doc.write(sampleHTML);
      doc.close();
      
      setTimeout(() => setIsRefreshing(false), 300);
    } catch (error) {
      console.error('Failed to update preview:', error);
      setIsRefreshing(false);
    }
  };

  const handleDeviceModeChange = (mode) => {
    setPreviewMode(mode);
  };

  const handleZoomChange = (newZoom) => {
    setZoomLevel(Math.max(25, Math.min(200, newZoom)));
  };

  const refreshPreview = () => {
    updatePreview();
  };

  const getCurrentDevice = () => {
    return deviceModes.find(device => device.id === previewMode) || deviceModes[0];
  };

  const getPreviewStyles = () => {
    const device = getCurrentDevice();
    const styles = {
      width: device.width,
      height: device.height,
      transform: `scale(${zoomLevel / 100})`,
      transformOrigin: 'top left'
    };
    
    if (previewMode !== 'desktop') {
      styles.border = '1px solid #d1d5db';
      styles.borderRadius = '12px';
      styles.overflow = 'hidden';
    }
    
    return styles;
  };

  return (
    <div className="h-full flex flex-col bg-surface border border-border rounded-lg overflow-hidden">
      {/* Preview Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-surface-50">
        <div className="flex items-center space-x-2">
          <Icon name="Eye" size={16} className="text-text-secondary" />
          <span className="text-sm font-medium text-text-primary">Live Preview</span>
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
            onClick={() => setShowGrid(!showGrid)}
            iconName="Grid3X3"
            iconSize={14}
            className={showGrid ? 'bg-accent-50 text-accent-700' : ''}
          >
            Grid
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshPreview}
            loading={isRefreshing}
            iconName="RefreshCw"
            iconSize={14}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Device Mode Selector */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-surface-50">
        <div className="flex items-center space-x-1">
          {deviceModes.map((device) => (
            <button
              key={device.id}
              onClick={() => handleDeviceModeChange(device.id)}
              className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                previewMode === device.id
                  ? 'bg-primary-100 text-primary-700 border border-primary-200' :'text-text-secondary hover:text-text-primary hover:bg-surface-100'
              }`}
            >
              <Icon name={device.icon} size={14} />
              <span className="hidden sm:inline">{device.name}</span>
            </button>
          ))}
        </div>
        
        {/* Zoom Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleZoomChange(zoomLevel - 25)}
            className="p-1 text-text-secondary hover:text-text-primary transition-colors duration-200"
            disabled={zoomLevel <= 25}
          >
            <Icon name="ZoomOut" size={14} />
          </button>
          
          <span className="text-xs text-text-secondary min-w-12 text-center">
            {zoomLevel}%
          </span>
          
          <button
            onClick={() => handleZoomChange(zoomLevel + 25)}
            className="p-1 text-text-secondary hover:text-text-primary transition-colors duration-200"
            disabled={zoomLevel >= 200}
          >
            <Icon name="ZoomIn" size={14} />
          </button>
        </div>
      </div>

      {/* Preview Container */}
      <div className="flex-1 overflow-auto bg-secondary-50 p-4 relative">
        {showGrid && (
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />
        )}
        
        <div className="flex justify-center items-start min-h-full">
          <div style={getPreviewStyles()}>
            <iframe
              ref={iframeRef}
              className="w-full h-full bg-white"
              style={{ minHeight: previewMode === 'desktop' ? '600px' : getCurrentDevice().height }}
              title="CSS Preview"
              sandbox="allow-same-origin"
            />
          </div>
        </div>
        
        {isRefreshing && (
          <div className="absolute inset-0 bg-surface/50 flex items-center justify-center">
            <div className="flex items-center space-x-2 bg-surface px-4 py-2 rounded-lg shadow-elevation-2">
              <Icon name="Loader2" size={16} className="text-primary-500 animate-spin" />
              <span className="text-sm text-text-primary">Updating preview...</span>
            </div>
          </div>
        )}
      </div>

      {/* Preview Info */}
      <div className="flex items-center justify-between p-2 border-t border-border bg-surface-50 text-xs text-text-muted">
        <div className="flex items-center space-x-4">
          <span>Device: {getCurrentDevice().name}</span>
          <span>Zoom: {zoomLevel}%</span>
          {previewMode !== 'desktop' && (
            <span>Size: {getCurrentDevice().width} × {getCurrentDevice().height}</span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-success-600">
            <Icon name="Wifi" size={12} />
            <span>Live</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePreview;