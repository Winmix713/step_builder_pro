import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ConfigurationPreview = ({ configuration, validationStatus }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('json');
  const [copyStatus, setCopyStatus] = useState('');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('stepBuilderPro_language');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const generateConfigurationCode = (format) => {
    switch (format) {
      case 'json':
        return JSON.stringify(configuration, null, 2);
      case 'package':
        return generatePackageJson();
      case 'vite':
        return generateViteConfig();
      case 'tailwind':
        return generateTailwindConfig();
      default:
        return JSON.stringify(configuration, null, 2);
    }
  };

  const generatePackageJson = () => {
    const packageJson = {
      name: configuration.projectName?.toLowerCase().replace(/\s+/g, '-') || 'my-project',
      version: configuration.version || '1.0.0',
      description: configuration.projectDescription || 'A React application built with Step Builder Pro',
      author: configuration.author || 'Unknown',
      private: true,
      type: 'module',
      scripts: {
        dev: configuration.buildTool === 'vite' ? 'vite' : 'webpack serve',
        build: configuration.buildTool === 'vite' ? 'vite build' : 'webpack build',
        preview: configuration.buildTool === 'vite' ? 'vite preview' : 'serve dist',
        lint: configuration.eslint ? 'eslint . --ext js,jsx,ts,tsx' : undefined,
        test: configuration.testing ? 'jest' : undefined
      },
      dependencies: {
        react: configuration.reactVersion || '18.2.0',
        'react-dom': configuration.reactVersion || '18.2.0',
        ...(configuration.routing && { 'react-router-dom': '^6.8.1' }),
        ...(configuration.stateManagement === 'redux' && { '@reduxjs/toolkit': '^1.9.3', 'react-redux': '^8.0.5' }),
        ...(configuration.stateManagement === 'zustand' && { zustand: '^4.3.6' }),
        ...(configuration.formHandling === 'react-hook-form' && { 'react-hook-form': '^7.43.5' }),
        ...(configuration.formHandling === 'formik' && { formik: '^2.2.9' }),
        ...(configuration.cssFramework === 'tailwind' && { tailwindcss: '^3.2.7' }),
        ...(configuration.cssFramework === 'bootstrap' && { bootstrap: '^5.2.3' }),
        ...(configuration.cssFramework === 'material-ui' && { '@mui/material': '^5.11.10' }),
        ...(configuration.animations === 'framer-motion' && { 'framer-motion': '^10.0.1' }),
        ...(configuration.animations === 'react-spring' && { '@react-spring/web': '^9.6.1' }),
        ...(configuration.i18n && { 'react-i18next': '^12.2.0', i18next: '^22.4.10' })
      },
      devDependencies: {
        ...(configuration.buildTool === 'vite' && { 
          vite: '^4.1.4', 
          '@vitejs/plugin-react': '^3.1.0' 
        }),
        ...(configuration.typescript && { 
          typescript: '^4.9.5', 
          '@types/react': '^18.0.28', 
          '@types/react-dom': '^18.0.11' 
        }),
        ...(configuration.eslint && { 
          eslint: '^8.36.0', 
          'eslint-plugin-react': '^7.32.2' 
        }),
        ...(configuration.testing && { 
          jest: '^29.5.0', 
          '@testing-library/react': '^14.0.0', 
          '@testing-library/jest-dom': '^5.16.5' 
        })
      }
    };

    // Remove undefined values
    Object.keys(packageJson.scripts).forEach(key => {
      if (packageJson.scripts[key] === undefined) {
        delete packageJson.scripts[key];
      }
    });

    return JSON.stringify(packageJson, null, 2);
  };

  const generateViteConfig = () => {
    return `import { defineConfig } from 'vite';
 import react from'@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    ${configuration.bundleSize > 5 ? `
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ${configuration.routing ? `router: ['react-router-dom'],` : ''}
          ${configuration.stateManagement === 'redux' ? `redux: ['@reduxjs/toolkit', 'react-redux'],` : ''}
        }
      }
    }` : ''}
  },
  ${configuration.pwa ? `
  // PWA Configuration would go here
  ` : ''}
})`;
  };

  const generateTailwindConfig = () => {
    if (configuration.cssFramework !== 'tailwind') {
      return '// Tailwind CSS not selected in configuration';
    }

    return `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  ${configuration.darkMode ? `
  darkMode: 'class',` : ''}
  theme: {
    extend: {
      ${configuration.responsive ? `
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },` : ''}
      ${configuration.animations !== 'css-animations' ? `
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },` : ''}
    },
  },
  plugins: [
    ${configuration.formHandling ? `require('@tailwindcss/forms'),` : ''}
    ${configuration.typography ? `require('@tailwindcss/typography'),` : ''}
  ],
}`;
  };

  const handleCopyToClipboard = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus(''), 2000);
    } catch (err) {
      setCopyStatus('error');
      setTimeout(() => setCopyStatus(''), 2000);
    }
  };

  const tabs = [
    { id: 'json', label: 'Configuration', icon: 'Settings' },
    { id: 'package', label: 'package.json', icon: 'Package' },
    { id: 'vite', label: 'vite.config.js', icon: 'Zap' },
    { id: 'tailwind', label: 'tailwind.config.js', icon: 'Palette' }
  ];

  const getValidationStatusColor = () => {
    switch (validationStatus) {
      case 'valid':
        return 'text-success-600 bg-success-50 border-success-200';
      case 'invalid':
        return 'text-error-600 bg-error-50 border-error-200';
      case 'warning':
        return 'text-warning-600 bg-warning-50 border-warning-200';
      default:
        return 'text-text-muted bg-surface-50 border-border';
    }
  };

  const getValidationIcon = () => {
    switch (validationStatus) {
      case 'valid':
        return 'CheckCircle';
      case 'invalid':
        return 'XCircle';
      case 'warning':
        return 'AlertTriangle';
      default:
        return 'Clock';
    }
  };

  return (
    <div className="h-full flex flex-col bg-surface border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-surface-50">
        <div className="flex items-center space-x-2">
          <Icon name="Eye" size={16} className="text-text-secondary" />
          <h3 className="text-sm font-medium text-text-primary">Configuration Preview</h3>
        </div>
        
        {/* Validation Status */}
        <div className={`flex items-center space-x-2 px-2 py-1 rounded-md border text-xs ${getValidationStatusColor()}`}>
          <Icon name={getValidationIcon()} size={12} />
          <span className="capitalize">{validationStatus || 'pending'}</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-border bg-surface-50">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors duration-200 border-b-2 ${
              activeTab === tab.id
                ? 'text-primary-600 border-primary-500 bg-surface' :'text-text-secondary border-transparent hover:text-text-primary hover:bg-surface'
            }`}
          >
            <Icon name={tab.icon} size={14} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Code Preview */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 overflow-auto">
          <div className="p-4">
            <div className="relative">
              {/* Copy Button */}
              <div className="absolute top-2 right-2 z-10">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyToClipboard(generateConfigurationCode(activeTab))}
                  iconName={copyStatus === 'copied' ? 'Check' : copyStatus === 'error' ? 'X' : 'Copy'}
                  iconSize={14}
                  className={`${
                    copyStatus === 'copied' ? 'text-success-600' : 
                    copyStatus === 'error' ? 'text-error-600' : 'text-text-secondary'
                  }`}
                />
              </div>

              {/* Code Block */}
              <pre className="bg-secondary-900 text-secondary-100 p-4 rounded-lg overflow-x-auto text-sm font-mono leading-relaxed">
                <code>{generateConfigurationCode(activeTab)}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="p-3 border-t border-border bg-surface-50">
        <div className="flex items-center justify-between text-xs text-text-muted">
          <div className="flex items-center space-x-4">
            <span>Lines: {generateConfigurationCode(activeTab).split('\n').length}</span>
            <span>Size: {new Blob([generateConfigurationCode(activeTab)]).size} bytes</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Zap" size={12} />
            <span>Live Preview</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationPreview;