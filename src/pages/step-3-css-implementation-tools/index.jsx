import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import StepProgressHeader from '../../components/ui/StepProgressHeader';
import StepNavigationControls from '../../components/ui/StepNavigationControls';
import ProjectContextIndicator from '../../components/ui/ProjectContextIndicator';
import CSSEditor from './components/CSSEditor';
import LivePreview from './components/LivePreview';
import CSSControlBar from './components/CSSControlBar';
import MobileTabInterface from './components/MobileTabInterface';

const Step3CSSImplementationTools = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [cssCode, setCSSCode] = useState('');
  const [selectedFramework, setSelectedFramework] = useState('vanilla');
  const [customProperties, setCustomProperties] = useState({});
  const [isValidCSS, setIsValidCSS] = useState(true);
  const [activeTab, setActiveTab] = useState('code');

  // Load saved data on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('stepBuilderPro_language');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }

    // Load saved CSS implementation data
    const savedCSSData = localStorage.getItem('stepBuilderPro_step3_cssData');
    if (savedCSSData) {
      try {
        const parsedData = JSON.parse(savedCSSData);
        setCSSCode(parsedData.cssCode || '');
        setSelectedFramework(parsedData.selectedFramework || 'vanilla');
        setCustomProperties(parsedData.customProperties || {});
      } catch (error) {
        console.error('Failed to load saved CSS data:', error);
      }
    } else {
      // Set default CSS code for demonstration
      const defaultCSS = `/* Welcome to CSS Implementation Tools */

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn-secondary {
  background: #6b7280;
}

.btn-secondary:hover {
  background: #4b5563;
}

.btn-outline {
  background: transparent;
  color: #3b82f6;
  border: 2px solid #3b82f6;
}

.btn-outline:hover {
  background: #3b82f6;
  color: white;
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  border: 1px solid #f1f5f9;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.card h3 {
  margin: 0 0 1rem 0;
  color: #1f2937;
  font-size: 1.25rem;
  font-weight: 600;
}

.card p {
  margin: 0 0 1.5rem 0;
  color: #6b7280;
  line-height: 1.6;
}

.flex-container {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin: 2rem 0;
}

.flex-item {
  flex: 1;
  min-width: 200px;
  padding: 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  text-align: center;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}

.grid-item {
  padding: 1.5rem;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 0.5rem;
  text-align: center;
  color: #0369a1;
  font-weight: 500;
}

.responsive-text {
  font-size: clamp(1.5rem, 4vw, 3rem);
  font-weight: 700;
  color: #1f2937;
  margin: 2rem 0;
  text-align: center;
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .flex-container {
    flex-direction: column;
  }
  
  .grid-container {
    grid-template-columns: 1fr;
  }
  
  .btn {
    width: 100%;
    text-align: center;
  }
}`;
      setCSSCode(defaultCSS);
    }
  }, []);

  // Auto-save CSS data when it changes
  useEffect(() => {
    const cssData = {
      cssCode,
      selectedFramework,
      customProperties,
      lastSaved: new Date().toISOString()
    };
    
    localStorage.setItem('stepBuilderPro_step3_cssData', JSON.stringify(cssData));
  }, [cssCode, selectedFramework, customProperties]);

  const handleCSSChange = (newCSS) => {
    setCSSCode(newCSS);
  };

  const handleFrameworkChange = (framework) => {
    setSelectedFramework(framework);
  };

  const handleCustomPropertiesChange = (properties) => {
    setCustomProperties(properties);
  };

  const handleValidationChange = (isValid) => {
    setIsValidCSS(isValid);
  };

  const handleImportCSS = (importedCSS) => {
    setCSSCode(importedCSS);
  };

  const handleExportCSS = () => {
    const cssData = {
      framework: selectedFramework,
      customProperties,
      css: cssCode,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([cssCode], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `step3_styles_${selectedFramework}.css`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Also export JSON with metadata
    const jsonBlob = new Blob([JSON.stringify(cssData, null, 2)], { type: 'application/json' });
    const jsonUrl = URL.createObjectURL(jsonBlob);
    const jsonA = document.createElement('a');
    jsonA.href = jsonUrl;
    jsonA.download = `step3_css_config.json`;
    document.body.appendChild(jsonA);
    jsonA.click();
    document.body.removeChild(jsonA);
    URL.revokeObjectURL(jsonUrl);
  };

  return (
    <>
      <Helmet>
        <title>Step 3: CSS Implementation Tools - Step Builder Pro</title>
        <meta name="description" content="Advanced CSS implementation tools with live preview, syntax highlighting, and framework integration for Step Builder Pro." />
        <meta name="keywords" content="CSS, styling, implementation, tools, live preview, code editor" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Global Navigation */}
        <StepProgressHeader />

        {/* Main Content */}
        <main className="pt-16 md:pt-24 pb-20 md:pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Page Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
                    CSS Implementation Tools
                  </h1>
                  <p className="text-text-secondary max-w-2xl">
                    Create and customize CSS styles with live preview, syntax highlighting, and framework integration. 
                    Write custom CSS or use pre-built templates with real-time validation.
                  </p>
                </div>
                <div className="hidden md:block">
                  <ProjectContextIndicator />
                </div>
              </div>
            </div>

            {/* Control Bar */}
            <CSSControlBar
              selectedFramework={selectedFramework}
              onFrameworkChange={handleFrameworkChange}
              customProperties={customProperties}
              onCustomPropertiesChange={handleCustomPropertiesChange}
              onImport={handleImportCSS}
              onExport={handleExportCSS}
            />

            {/* Desktop Layout - Split Screen */}
            <div className="hidden md:block">
              <div className="grid grid-cols-2 gap-6 h-[calc(100vh-300px)]">
                {/* Left Panel - CSS Editor */}
                <div className="flex flex-col">
                  <CSSEditor
                    cssCode={cssCode}
                    onCSSChange={handleCSSChange}
                    selectedFramework={selectedFramework}
                    onValidationChange={handleValidationChange}
                  />
                </div>

                {/* Right Panel - Live Preview */}
                <div className="flex flex-col">
                  <LivePreview
                    cssCode={cssCode}
                    selectedFramework={selectedFramework}
                  />
                </div>
              </div>
            </div>

            {/* Mobile Layout - Tabbed Interface */}
            <div className="md:hidden">
              <MobileTabInterface
                cssCode={cssCode}
                onCSSChange={handleCSSChange}
                selectedFramework={selectedFramework}
                onValidationChange={handleValidationChange}
              >
                <div className="h-[calc(100vh-200px)]">
                  {activeTab === 'code' ? (
                    <CSSEditor
                      cssCode={cssCode}
                      onCSSChange={handleCSSChange}
                      selectedFramework={selectedFramework}
                      onValidationChange={handleValidationChange}
                    />
                  ) : activeTab === 'preview' ? (
                    <LivePreview
                      cssCode={cssCode}
                      selectedFramework={selectedFramework}
                    />
                  ) : (
                    <div className="p-4">
                      <CSSControlBar
                        selectedFramework={selectedFramework}
                        onFrameworkChange={handleFrameworkChange}
                        customProperties={customProperties}
                        onCustomPropertiesChange={handleCustomPropertiesChange}
                        onImport={handleImportCSS}
                        onExport={handleExportCSS}
                      />
                    </div>
                  )}
                </div>
              </MobileTabInterface>
            </div>

            {/* Status Indicators */}
            <div className="hidden md:flex items-center justify-between mt-6 p-4 bg-surface-50 rounded-lg border border-border">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isValidCSS ? 'bg-success-500' : 'bg-warning-500'}`} />
                  <span className="text-sm text-text-secondary">
                    CSS {isValidCSS ? 'Valid' : 'Has Issues'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-accent-500" />
                  <span className="text-sm text-text-secondary">
                    Framework: {selectedFramework}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-primary-500" />
                  <span className="text-sm text-text-secondary">
                    {cssCode.length} characters
                  </span>
                </div>
              </div>
              
              <div className="text-xs text-text-muted">
                Auto-saved • Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </main>

        {/* Global Navigation Controls */}
        <StepNavigationControls />
      </div>
    </>
  );
};

export default Step3CSSImplementationTools;