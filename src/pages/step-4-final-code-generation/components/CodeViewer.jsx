import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';

const CodeViewer = ({ generatedCode, activeFormat, onFormatChange }) => {
  const [selectedLines, setSelectedLines] = useState([]);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [wordWrap, setWordWrap] = useState(false);
  const codeRef = useRef(null);

  const formats = [
    { id: 'react', label: 'React Components', icon: 'Component', language: 'jsx' },
    { id: 'html', label: 'HTML/CSS', icon: 'Code', language: 'html' },
    { id: 'vue', label: 'Vue.js', icon: 'Layers', language: 'vue' },
    { id: 'angular', label: 'Angular', icon: 'Triangle', language: 'typescript' },
    { id: 'vanilla', label: 'Vanilla JS', icon: 'Zap', language: 'javascript' }
  ];

  const defaultCode = {
    react: `import React from 'react';
import './styles.css';

const GeneratedComponent = () => {
  return (
    <div className="container">
      <header className="header">
        <h1 className="title">Generated Component</h1>
        <p className="subtitle">Built with Step Builder Pro</p>
      </header>
      
      <main className="main-content">
        <div className="card">
          <div className="card-header">
            <h3>Welcome to your generated component</h3>
          </div>
          <div className="card-body">
            <p>This component was automatically generated based on your configuration.</p>
            <button className="btn btn-primary">Get Started</button>
          </div>
        </div>
        
        <div className="grid-container">
          <div className="grid-item">
            <Icon name="Settings" size={24} />
            <h4>Configuration</h4>
            <p>Customize your settings</p>
          </div>
          <div className="grid-item">
            <Icon name="Palette" size={24} />
            <h4>Styling</h4>
            <p>Apply custom styles</p>
          </div>
          <div className="grid-item">
            <Icon name="Code" size={24} />
            <h4>Code Generation</h4>
            <p>Export your project</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GeneratedComponent;`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Page - Step Builder Pro</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <header class="header">
            <h1 class="title">Generated Page</h1>
            <p class="subtitle">Built with Step Builder Pro</p>
        </header>
        
        <main class="main-content">
            <div class="card">
                <div class="card-header">
                    <h3>Welcome to your generated page</h3>
                </div>
                <div class="card-body">
                    <p>This page was automatically generated based on your configuration.</p>
                    <button class="btn btn-primary">Get Started</button>
                </div>
            </div>
            
            <div class="grid-container">
                <div class="grid-item">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 1l3.09 6.26L22 9l-5 4.87L18.18 21 12 17.77 5.82 21 7 13.87 2 9l6.91-1.74L12 1z"/>
                    </svg>
                    <h4>Configuration</h4>
                    <p>Customize your settings</p>
                </div>
                <div class="grid-item">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 1l3.09 6.26L22 9l-5 4.87L18.18 21 12 17.77 5.82 21 7 13.87 2 9l6.91-1.74L12 1z"/>
                    </svg>
                    <h4>Styling</h4>
                    <p>Apply custom styles</p>
                </div>
                <div class="grid-item">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 1l3.09 6.26L22 9l-5 4.87L18.18 21 12 17.77 5.82 21 7 13.87 2 9l6.91-1.74L12 1z"/>
                    </svg>
                    <h4>Code Generation</h4>
                    <p>Export your project</p>
                </div>
            </div>
        </main>
    </div>
    
    <script src="script.js"></script>
</body>
</html>`,
    vue: `<template>
  <div class="container">
    <header class="header">
      <h1 class="title">Generated Vue Component</h1>
      <p class="subtitle">Built with Step Builder Pro</p>
    </header>
    
    <main class="main-content">
      <div class="card">
        <div class="card-header">
          <h3>Welcome to your generated component</h3>
        </div>
        <div class="card-body">
          <p>This component was automatically generated based on your configuration.</p>
          <button class="btn btn-primary" @click="handleClick">Get Started</button>
        </div>
      </div>
      
      <div class="grid-container">
        <div class="grid-item" v-for="item in features" :key="item.id">
          <component :is="item.icon" :size="24" />
          <h4>{{ item.title }}</h4>
          <p>{{ item.description }}</p>
        </div>
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
      { id: 1, title: 'Configuration', description: 'Customize your settings', icon: 'Settings' },
      { id: 2, title: 'Styling', description: 'Apply custom styles', icon: 'Palette' },
      { id: 3, title: 'Code Generation', description: 'Export your project', icon: 'Code' }
    ])

    const handleClick = () => {
      console.log('Button clicked!')
    }

    return {
      features,
      handleClick
    }
  }
}
</script>

<style scoped>
@import './styles.css';
</style>`,
    angular: `import { Component } from '@angular/core';

interface Feature {
  id: number;
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-generated',
  template: \`
    <div class="container">
      <header class="header">
        <h1 class="title">Generated Angular Component</h1>
        <p class="subtitle">Built with Step Builder Pro</p>
      </header>
      
      <main class="main-content">
        <div class="card">
          <div class="card-header">
            <h3>Welcome to your generated component</h3>
          </div>
          <div class="card-body">
            <p>This component was automatically generated based on your configuration.</p>
            <button class="btn btn-primary" (click)="handleClick()">Get Started</button>
          </div>
        </div>
        
        <div class="grid-container">
          <div class="grid-item" *ngFor="let item of features">
            <ng-container [ngSwitch]="item.icon">
              <svg *ngSwitchCase="'Settings'" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1l3.09 6.26L22 9l-5 4.87L18.18 21 12 17.77 5.82 21 7 13.87 2 9l6.91-1.74L12 1z"/>
              </svg>
              <svg *ngSwitchCase="'Palette'" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1l3.09 6.26L22 9l-5 4.87L18.18 21 12 17.77 5.82 21 7 13.87 2 9l6.91-1.74L12 1z"/>
              </svg>
              <svg *ngSwitchCase="'Code'" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1l3.09 6.26L22 9l-5 4.87L18.18 21 12 17.77 5.82 21 7 13.87 2 9l6.91-1.74L12 1z"/>
              </svg>
            </ng-container>
            <h4>{{ item.title }}</h4>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </main>
    </div>
  \`,
  styleUrls: ['./generated.component.css']
})
export class GeneratedComponent {
  features: Feature[] = [
    { id: 1, title: 'Configuration', description: 'Customize your settings', icon: 'Settings' },
    { id: 2, title: 'Styling', description: 'Apply custom styles', icon: 'Palette' },
    { id: 3, title: 'Code Generation', description: 'Export your project', icon: 'Code' }
  ];

  handleClick(): void {
    console.log('Button clicked!');
  }
}`,
    vanilla: `// Generated JavaScript - Step Builder Pro
class GeneratedApp {
  constructor() {
    this.features = [
      { id: 1, title: 'Configuration', description: 'Customize your settings', icon: 'settings' },
      { id: 2, title: 'Styling', description: 'Apply custom styles', icon: 'palette' },
      { id: 3, title: 'Code Generation', description: 'Export your project', icon: 'code' }
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
      <div class="container">
        <header class="header">
          <h1 class="title">Generated JavaScript App</h1>
          <p class="subtitle">Built with Step Builder Pro</p>
        </header>
        
        <main class="main-content">
          <div class="card">
            <div class="card-header">
              <h3>Welcome to your generated app</h3>
            </div>
            <div class="card-body">
              <p>This app was automatically generated based on your configuration.</p>
              <button class="btn btn-primary" id="startBtn">Get Started</button>
            </div>
          </div>
          
          <div class="grid-container">
            \${this.features.map(feature => \`
              <div class="grid-item">
                <div class="icon-\${feature.icon}"></div>
                <h4>\${feature.title}</h4>
                <p>\${feature.description}</p>
              </div>
            \`).join('')}
          </div>
        </main>
      </div>
    \`;
  }

  attachEventListeners() {
    const startBtn = document.getElementById('startBtn');
    if (startBtn) {
      startBtn.addEventListener('click', this.handleClick.bind(this));
    }
  }

  handleClick() {
    console.log('Button clicked!');
    alert('Welcome to your generated application!');
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new GeneratedApp();
});`
  };

  useEffect(() => {
    if (codeRef.current) {
      // Apply syntax highlighting here if needed
      // This is a placeholder for syntax highlighting library integration
    }
  }, [activeFormat, generatedCode]);

  const getCurrentCode = () => {
    return generatedCode?.[activeFormat] || defaultCode[activeFormat] || '';
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(getCurrentCode());
      // Could show a toast notification here
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  const handleSelectAll = () => {
    if (codeRef.current) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(codeRef.current);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  };

  const formatCode = (code) => {
    return code.split('\n').map((line, index) => ({
      number: index + 1,
      content: line,
      isEmpty: line.trim() === ''
    }));
  };

  const currentFormat = formats.find(f => f.id === activeFormat) || formats[0];
  const codeLines = formatCode(getCurrentCode());

  return (
    <div className="flex flex-col h-full bg-surface border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-surface-50">
        <div className="flex items-center space-x-3">
          <Icon name={currentFormat.icon} size={16} className="text-text-secondary" />
          <span className="text-sm font-medium text-text-primary">
            {currentFormat.label}
          </span>
          <div className="flex items-center space-x-1 text-xs text-text-muted">
            <span>{codeLines.length} lines</span>
            <div className="w-1 h-1 bg-text-muted rounded-full" />
            <span>{getCurrentCode().length} characters</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowLineNumbers(!showLineNumbers)}
            className="flex items-center space-x-1 px-2 py-1 text-xs text-text-secondary hover:text-text-primary hover:bg-surface rounded transition-colors duration-200"
            title="Toggle line numbers"
          >
            <Icon name="Hash" size={12} />
            <span className="hidden sm:inline">Lines</span>
          </button>

          <button
            onClick={() => setWordWrap(!wordWrap)}
            className="flex items-center space-x-1 px-2 py-1 text-xs text-text-secondary hover:text-text-primary hover:bg-surface rounded transition-colors duration-200"
            title="Toggle word wrap"
          >
            <Icon name="WrapText" size={12} />
            <span className="hidden sm:inline">Wrap</span>
          </button>

          <div className="w-px h-4 bg-border" />

          <button
            onClick={handleSelectAll}
            className="flex items-center space-x-1 px-2 py-1 text-xs text-text-secondary hover:text-text-primary hover:bg-surface rounded transition-colors duration-200"
            title="Select all"
          >
            <Icon name="MousePointer" size={12} />
            <span className="hidden sm:inline">Select All</span>
          </button>

          <button
            onClick={handleCopyCode}
            className="flex items-center space-x-1 px-2 py-1 text-xs text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded transition-colors duration-200"
            title="Copy code"
          >
            <Icon name="Copy" size={12} />
            <span className="hidden sm:inline">Copy</span>
          </button>
        </div>
      </div>

      {/* Format Tabs */}
      <div className="flex items-center space-x-1 p-2 border-b border-border bg-surface-50 overflow-x-auto">
        {formats.map((format) => (
          <button
            key={format.id}
            onClick={() => onFormatChange?.(format.id)}
            className={`flex items-center space-x-2 px-3 py-1.5 text-xs font-medium whitespace-nowrap rounded transition-colors duration-200 ${
              activeFormat === format.id
                ? 'bg-primary-100 text-primary-700 border border-primary-200' :'text-text-secondary hover:text-text-primary hover:bg-surface'
            }`}
          >
            <Icon name={format.icon} size={14} />
            <span>{format.label}</span>
          </button>
        ))}
      </div>

      {/* Code Content */}
      <div className="flex-1 overflow-auto">
        <div className="relative">
          <pre
            ref={codeRef}
            className={`text-sm leading-relaxed p-4 font-mono text-text-primary bg-surface min-h-full ${
              wordWrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre'
            }`}
            style={{ fontSize: `${fontSize}px` }}
          >
            {codeLines.map((line, index) => (
              <div key={index} className="flex hover:bg-surface-50 transition-colors duration-150">
                {showLineNumbers && (
                  <span className="select-none text-text-muted mr-4 text-right w-8 flex-shrink-0">
                    {line.number}
                  </span>
                )}
                <span className={`flex-1 ${line.isEmpty ? 'min-h-[1.5em]' : ''}`}>
                  {line.content}
                </span>
              </div>
            ))}
          </pre>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-2 border-t border-border bg-surface-50 text-xs text-text-muted">
        <div className="flex items-center space-x-4">
          <span>Language: {currentFormat.language}</span>
          <span>Encoding: UTF-8</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFontSize(Math.max(10, fontSize - 1))}
            className="p-1 hover:bg-surface rounded"
            title="Decrease font size"
          >
            <Icon name="Minus" size={12} />
          </button>
          <span className="px-2">{fontSize}px</span>
          <button
            onClick={() => setFontSize(Math.min(20, fontSize + 1))}
            className="p-1 hover:bg-surface rounded"
            title="Increase font size"
          >
            <Icon name="Plus" size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeViewer;