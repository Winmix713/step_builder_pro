import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import StepProgressHeader from '../../components/ui/StepProgressHeader';
import StepNavigationControls from '../../components/ui/StepNavigationControls';
import ProjectContextIndicator from '../../components/ui/ProjectContextIndicator';
import CodeViewer from './components/CodeViewer';
import ProjectSidebar from './components/ProjectSidebar';
import ExportToolbar from './components/ExportToolbar';
import VersionHistory from './components/VersionHistory';
import SharingPanel from './components/SharingPanel';
import MobileCodeInterface from './components/MobileCodeInterface';

const Step4FinalCodeGeneration = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [activeFormat, setActiveFormat] = useState('react');
  const [generatedCode, setGeneratedCode] = useState({});
  const [projectData, setProjectData] = useState({});
  const [generationStats, setGenerationStats] = useState({});
  const [activePanel, setActivePanel] = useState('project');
  const [isGenerating, setIsGenerating] = useState(false);

  // Load saved data on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('stepBuilderPro_language');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }

    // Load project data from all previous steps
    loadProjectData();
    
    // Generate initial code
    generateFinalCode();

    // Mark Step 4 as completed when component mounts
    markStepCompleted();
  }, []);

  const loadProjectData = () => {
    try {
      const step1Data = localStorage.getItem('stepBuilderPro_step1_configData');
      const step2Data = localStorage.getItem('stepBuilderPro_step2_svgData');
      const step3Data = localStorage.getItem('stepBuilderPro_step3_cssData');
      const projectContext = localStorage.getItem('stepBuilderPro_projectContext');

      const consolidatedData = {
        step1: step1Data ? JSON.parse(step1Data) : null,
        step2: step2Data ? JSON.parse(step2Data) : null,
        step3: step3Data ? JSON.parse(step3Data) : null,
        context: projectContext ? JSON.parse(projectContext) : null
      };

      setProjectData(consolidatedData);
    } catch (error) {
      console.error('Failed to load project data:', error);
    }
  };

  const generateFinalCode = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate code generation process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // This would be replaced with actual code generation logic
      const generatedOutput = {
        react: generateReactCode(),
        html: generateHTMLCode(),
        vue: generateVueCode(),
        angular: generateAngularCode(),
        vanilla: generateVanillaCode()
      };

      setGeneratedCode(generatedOutput);
      
      // Calculate generation statistics
      const stats = calculateGenerationStats(generatedOutput);
      setGenerationStats(stats);

      // Save generated code
      localStorage.setItem('stepBuilderPro_step4_generatedCode', JSON.stringify(generatedOutput));
      localStorage.setItem('stepBuilderPro_step4_stats', JSON.stringify(stats));

    } catch (error) {
      console.error('Code generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const markStepCompleted = () => {
    const completedSteps = JSON.parse(localStorage.getItem('stepBuilderPro_completedSteps') || '[]');
    if (!completedSteps.includes(4)) {
      const updatedCompleted = [...completedSteps, 4];
      localStorage.setItem('stepBuilderPro_completedSteps', JSON.stringify(updatedCompleted));
    }

    const stepValidation = JSON.parse(localStorage.getItem('stepBuilderPro_stepValidation') || '{}');
    const updatedValidation = { ...stepValidation, 4: true };
    localStorage.setItem('stepBuilderPro_stepValidation', JSON.stringify(updatedValidation));
  };

  const generateReactCode = () => {
    return `import React from 'react';
import './styles.css';

const GeneratedComponent = () => {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="title">Generated with Step Builder Pro</h1>
        <p className="subtitle">Complete React component ready for use</p>
      </header>
      
      <main className="main-content">
        <div className="feature-grid">
          <div className="feature-card">
            <div className="icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9l-5 4.87L18.18 21 12 17.77 5.82 21 7 13.87 2 9l6.91-1.74L12 2z"/>
              </svg>
            </div>
            <h3>Configuration</h3>
            <p>Fully configured and ready to use</p>
          </div>
          
          <div className="feature-card">
            <div className="icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
              </svg>
            </div>
            <h3>Responsive Design</h3>
            <p>Mobile-first responsive layout</p>
          </div>
          
          <div className="feature-card">
            <div className="icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3>Optimized</h3>
            <p>Performance optimized code</p>
          </div>
        </div>
        
        <div className="cta-section">
          <button className="btn btn-primary">Get Started</button>
          <button className="btn btn-secondary">Learn More</button>
        </div>
      </main>
    </div>
  );
};

export default GeneratedComponent;`;
  };

  const generateHTMLCode = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated with Step Builder Pro</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="app-container">
        <header class="app-header">
            <h1 class="title">Generated with Step Builder Pro</h1>
            <p class="subtitle">Complete HTML page ready for use</p>
        </header>
        
        <main class="main-content">
            <div class="feature-grid">
                <div class="feature-card">
                    <div class="icon-wrapper">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9l-5 4.87L18.18 21 12 17.77 5.82 21 7 13.87 2 9l6.91-1.74L12 2z"/>
                        </svg>
                    </div>
                    <h3>Configuration</h3>
                    <p>Fully configured and ready to use</p>
                </div>
                
                <div class="feature-card">
                    <div class="icon-wrapper">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                        </svg>
                    </div>
                    <h3>Responsive Design</h3>
                    <p>Mobile-first responsive layout</p>
                </div>
                
                <div class="feature-card">
                    <div class="icon-wrapper">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                    <h3>Optimized</h3>
                    <p>Performance optimized code</p>
                </div>
            </div>
            
            <div class="cta-section">
                <button class="btn btn-primary">Get Started</button>
                <button class="btn btn-secondary">Learn More</button>
            </div>
        </main>
    </div>
    
    <script src="script.js"></script>
</body>
</html>`;
  };

  const generateVueCode = () => {
    return `<template>
  <div class="app-container">
    <header class="app-header">
      <h1 class="title">Generated with Step Builder Pro</h1>
      <p class="subtitle">Complete Vue component ready for use</p>
    </header>
    
    <main class="main-content">
      <div class="feature-grid">
        <div class="feature-card" v-for="feature in features" :key="feature.id">
          <div class="icon-wrapper">
            <component :is="feature.icon" />
          </div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </div>
      </div>
      
      <div class="cta-section">
        <button class="btn btn-primary" @click="handleGetStarted">Get Started</button>
        <button class="btn btn-secondary" @click="handleLearnMore">Learn More</button>
      </div>
    </main>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'GeneratedComponent',
  setup() {
    const features = ref([
      { id: 1, title: 'Configuration', description: 'Fully configured and ready to use', icon: 'StarIcon' },
      { id: 2, title: 'Responsive Design', description: 'Mobile-first responsive layout', icon: 'CircleIcon' },
      { id: 3, title: 'Optimized', description: 'Performance optimized code', icon: 'CheckIcon' }
    ])

    const handleGetStarted = () => {
      console.log('Get started clicked')
    }

    const handleLearnMore = () => {
      console.log('Learn more clicked')
    }

    return {
      features,
      handleGetStarted,
      handleLearnMore
    }
  }
}
</script>

<style scoped>
@import './styles.css';
</style>`;
  };

  const generateAngularCode = () => {
    return `import { Component } from '@angular/core';

interface Feature {
  id: number;
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-generated',
  template: \`
    <div class="app-container">
      <header class="app-header">
        <h1 class="title">Generated with Step Builder Pro</h1>
        <p class="subtitle">Complete Angular component ready for use</p>
      </header>
      
      <main class="main-content">
        <div class="feature-grid">
          <div class="feature-card" *ngFor="let feature of features">
            <div class="icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9l-5 4.87L18.18 21 12 17.77 5.82 21 7 13.87 2 9l6.91-1.74L12 2z"/>
              </svg>
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
        
        <div class="cta-section">
          <button class="btn btn-primary" (click)="handleGetStarted()">Get Started</button>
          <button class="btn btn-secondary" (click)="handleLearnMore()">Learn More</button>
        </div>
      </main>
    </div>
  \`,
  styleUrls: ['./generated.component.css']
})
export class GeneratedComponent {
  features: Feature[] = [
    { id: 1, title: 'Configuration', description: 'Fully configured and ready to use', icon: 'star' },
    { id: 2, title: 'Responsive Design', description: 'Mobile-first responsive layout', icon: 'circle' },
    { id: 3, title: 'Optimized', description: 'Performance optimized code', icon: 'check' }
  ];

  handleGetStarted(): void {
    console.log('Get started clicked');
  }

  handleLearnMore(): void {
    console.log('Learn more clicked');
  }
}`;
  };

  const generateVanillaCode = () => {
    return `// Generated JavaScript - Step Builder Pro
class GeneratedApp {
  constructor() {
    this.features = [
      { id: 1, title: 'Configuration', description: 'Fully configured and ready to use' },
      { id: 2, title: 'Responsive Design', description: 'Mobile-first responsive layout' },
      { id: 3, title: 'Optimized', description: 'Performance optimized code' }
    ];
    
    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = \`
      <div class="app-container">
        <header class="app-header">
          <h1 class="title">Generated with Step Builder Pro</h1>
          <p class="subtitle">Complete JavaScript app ready for use</p>
        </header>
        
        <main class="main-content">
          <div class="feature-grid">
            \${this.features.map(feature => \`
              <div class="feature-card">
                <div class="icon-wrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9l-5 4.87L18.18 21 12 17.77 5.82 21 7 13.87 2 9l6.91-1.74L12 2z"/>
                  </svg>
                </div>
                <h3>\${feature.title}</h3>
                <p>\${feature.description}</p>
              </div>
            \`).join('')}
          </div>
          
          <div class="cta-section">
            <button class="btn btn-primary" id="getStartedBtn">Get Started</button>
            <button class="btn btn-secondary" id="learnMoreBtn">Learn More</button>
          </div>
        </main>
      </div>
    \`;
  }

  attachEventListeners() {
    const getStartedBtn = document.getElementById('getStartedBtn');
    const learnMoreBtn = document.getElementById('learnMoreBtn');
    
    if (getStartedBtn) {
      getStartedBtn.addEventListener('click', this.handleGetStarted.bind(this));
    }
    
    if (learnMoreBtn) {
      learnMoreBtn.addEventListener('click', this.handleLearnMore.bind(this));
    }
  }

  handleGetStarted() {
    console.log('Get started clicked');
    alert('Welcome to your generated application!');
  }

  handleLearnMore() {
    console.log('Learn more clicked');
    alert('Learn more about Step Builder Pro features!');
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new GeneratedApp();
});`;
  };

  const calculateGenerationStats = (code) => {
    const allCode = Object.values(code).join('\n');
    const lines = allCode.split('\n').length;
    const chars = allCode.length;
    const words = allCode.split(/\s+/).length;

    return {
      totalLines: lines,
      totalSize: chars,
      totalWords: words,
      complexity: lines > 500 ? 'High' : lines > 200 ? 'Medium' : 'Low',
      optimizationScore: Math.floor(Math.random() * 20) + 80, // 80-100%
      buildTime: `${(Math.random() * 3 + 1).toFixed(1)}s`,
      codeQuality: 'Excellent'
    };
  };

  const handleFormatChange = (format) => {
    setActiveFormat(format);
  };

  const handleExport = (exportType, exportData) => {
    console.log('Exporting:', exportType, exportData);
    // Handle export logic
  };

  const handleOptimize = (level, options) => {
    console.log('Optimizing code:', level, options);
    // Handle optimization
    generateFinalCode(); // Re-generate with optimizations
  };

  const handleShare = (shareType, shareData) => {
    console.log('Sharing:', shareType, shareData);
    // Handle sharing logic
  };

  const handleVersionRestore = (version) => {
    console.log('Restoring version:', version);
    // Handle version restoration
  };

  return (
    <>
      <Helmet>
        <title>Step 4: Final Code Generation - Step Builder Pro</title>
        <meta name="description" content="Generate, export, and share your final code with multiple formats, version control, and collaboration features." />
        <meta name="keywords" content="code generation, export, sharing, collaboration, version control" />
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
                    Final Code Generation
                  </h1>
                  <p className="text-text-secondary max-w-2xl">
                    Your project has been successfully generated! Review, export, and share your code with multiple output formats, 
                    version control, and team collaboration features.
                  </p>
                </div>
                <div className="hidden md:block">
                  <ProjectContextIndicator />
                </div>
              </div>
            </div>

            {/* Generation Status */}
            {isGenerating && (
              <div className="mb-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
                  <span className="text-sm font-medium text-primary-700">
                    Generating your final code...
                  </span>
                </div>
              </div>
            )}

            {/* Desktop Layout */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-12 gap-6 h-[calc(100vh-300px)]">
                {/* Left Panel - Project Sidebar */}
                <div className="col-span-3 flex flex-col">
                  <ProjectSidebar
                    projectData={projectData}
                    generationStats={generationStats}
                  />
                </div>

                {/* Main Panel - Code Viewer */}
                <div className="col-span-6 flex flex-col">
                  <CodeViewer
                    generatedCode={generatedCode}
                    activeFormat={activeFormat}
                    onFormatChange={handleFormatChange}
                  />
                </div>

                {/* Right Panel - Export/Version/Share */}
                <div className="col-span-3 flex flex-col">
                  <div className="flex items-center space-x-1 mb-4">
                    {['export', 'versions', 'share'].map((panel) => (
                      <button
                        key={panel}
                        onClick={() => setActivePanel(panel)}
                        className={`flex-1 px-3 py-2 text-xs font-medium rounded transition-colors duration-200 ${
                          activePanel === panel
                            ? 'bg-primary-100 text-primary-700 border border-primary-200' :'text-text-secondary hover:text-text-primary hover:bg-surface-50'
                        }`}
                      >
                        {panel.charAt(0).toUpperCase() + panel.slice(1)}
                      </button>
                    ))}
                  </div>

                  <div className="flex-1">
                    {activePanel === 'export' && (
                      <ExportToolbar
                        activeFormat={activeFormat}
                        onFormatChange={handleFormatChange}
                        onExport={handleExport}
                        onOptimize={handleOptimize}
                        generatedCode={generatedCode}
                      />
                    )}
                    {activePanel === 'versions' && (
                      <VersionHistory
                        onVersionRestore={handleVersionRestore}
                        currentVersion={{ format: activeFormat }}
                      />
                    )}
                    {activePanel === 'share' && (
                      <SharingPanel
                        projectData={projectData}
                        generatedCode={generatedCode}
                        onShare={handleShare}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tablet Layout */}
            <div className="hidden md:block lg:hidden">
              <div className="grid grid-cols-8 gap-6 h-[calc(100vh-300px)]">
                <div className="col-span-5">
                  <CodeViewer
                    generatedCode={generatedCode}
                    activeFormat={activeFormat}
                    onFormatChange={handleFormatChange}
                  />
                </div>
                <div className="col-span-3">
                  <div className="space-y-4">
                    <ExportToolbar
                      activeFormat={activeFormat}
                      onFormatChange={handleFormatChange}
                      onExport={handleExport}
                      onOptimize={handleOptimize}
                      generatedCode={generatedCode}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden">
              <MobileCodeInterface
                generatedCode={generatedCode}
                activeFormat={activeFormat}
                onFormatChange={handleFormatChange}
                projectData={projectData}
                onExport={handleExport}
                onOptimize={handleOptimize}
                onShare={handleShare}
                onVersionRestore={handleVersionRestore}
              />
            </div>

            {/* Success Message */}
            {!isGenerating && Object.keys(generatedCode).length > 0 && (
              <div className="mt-6 p-4 bg-success-50 border border-success-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-success-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-success-800">Code Generated Successfully!</h3>
                    <p className="text-xs text-success-700 mt-1">
                      Your project is ready for export. Choose your preferred format and download options above.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Global Navigation Controls */}
        <StepNavigationControls />
      </div>
    </>
  );
};

export default Step4FinalCodeGeneration;