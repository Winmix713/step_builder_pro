import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ExportControls = ({ 
  generatedCode, 
  onExport, 
  onShare, 
  selectedFormat,
  optimizationSettings,
  onOptimizationChange 
}) => {
  const [exportType, setExportType] = useState('single');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const exportOptions = [
    { id: 'single', label: 'Single File', icon: 'File', description: 'Export current format only' },
    { id: 'package', label: 'Complete Package', icon: 'Package', description: 'All formats + assets' },
    { id: 'zip', label: 'ZIP Archive', icon: 'Archive', description: 'Compressed project files' }
  ];

  const integrationOptions = [
    { id: 'github', label: 'GitHub Gist', icon: 'Github' },
    { id: 'codepen', label: 'CodePen', icon: 'Code2' },
    { id: 'codesandbox', label: 'CodeSandbox', icon: 'Box' },
    { id: 'stackblitz', label: 'StackBlitz', icon: 'Zap' }
  ];

  const handleExport = async (type) => {
    setIsExporting(true);
    try {
      switch (type) {
        case 'single':
          await exportSingleFile();
          break;
        case 'package':
          await exportCompletePackage();
          break;
        case 'zip':
          await exportZipArchive();
          break;
        default:
          break;
      }
      onExport?.(type);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportSingleFile = async () => {
    const code = generatedCode?.[selectedFormat] || '';
    const extension = getFileExtension(selectedFormat);
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `component.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportCompletePackage = async () => {
    const packageData = {
      components: generatedCode,
      metadata: {
        generatedAt: new Date().toISOString(),
        format: selectedFormat,
        optimization: optimizationSettings
      },
      assets: getProjectAssets(),
      styles: getProjectStyles()
    };

    const blob = new Blob([JSON.stringify(packageData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project-package.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportZipArchive = async () => {
    // In a real implementation, you'd use a library like JSZip console.log('ZIP export would be implemented with JSZip library');
  };

  const handleShare = async () => {
    try {
      const projectData = {
        code: generatedCode,
        format: selectedFormat,
        timestamp: Date.now()
      };
      
      // In a real implementation, this would create a share link via API
      const mockUrl = `https://stepbuilderpro.com/share/${btoa(JSON.stringify(projectData)).substring(0, 10)}`;
      setShareUrl(mockUrl);
      setShareModalOpen(true);
      
      onShare?.(mockUrl);
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const handleIntegration = (platform) => {
    const code = generatedCode?.[selectedFormat] || '';
    
    switch (platform) {
      case 'codepen':
        openCodePen(code);
        break;
      case 'codesandbox':
        openCodeSandbox(code);
        break;
      case 'stackblitz':
        openStackBlitz(code);
        break;
      case 'github':
        openGithubGist(code);
        break;
      default:
        break;
    }
  };

  const openCodePen = (code) => {
    const form = document.createElement('form');
    form.action = 'https://codepen.io/pen/define';
    form.method = 'POST';
    form.target = '_blank';
    
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'data';
    input.value = JSON.stringify({
      title: 'Generated Component',
      html: selectedFormat === 'html' ? code : '',
      js: selectedFormat === 'react' ? code : '',
      css: selectedFormat === 'css' ? code : ''
    });
    
    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  const openCodeSandbox = (code) => {
    const url = `https://codesandbox.io/api/v1/sandboxes/define?query=${encodeURIComponent(JSON.stringify({
      files: {
        'src/App.js': { content: code }
      },
      template: 'react'
    }))}`;
    window.open(url, '_blank');
  };

  const openStackBlitz = (code) => {
    window.open(`https://stackblitz.com/fork/react?file=src/App.js&embed=1&code=${encodeURIComponent(code)}`, '_blank');
  };

  const openGithubGist = (code) => {
    // This would require GitHub API integration
    console.log('GitHub Gist integration would require API setup');
  };

  const getFileExtension = (format) => {
    const extensions = {
      react: 'jsx',
      html: 'html',
      vue: 'vue',
      angular: 'ts',
      svelte: 'svelte'
    };
    return extensions[format] || 'txt';
  };

  const getProjectAssets = () => {
    return JSON.parse(localStorage.getItem('stepBuilderPro_step2_svgData') || '{}');
  };

  const getProjectStyles = () => {
    return JSON.parse(localStorage.getItem('stepBuilderPro_step3_cssData') || '{}');
  };

  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Type Selection */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-3">Export Type</h4>
        <div className="space-y-2">
          {exportOptions.map(option => (
            <label
              key={option.id}
              className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors duration-200 ${
                exportType === option.id 
                  ? 'border-primary-300 bg-primary-50' :'border-border hover:bg-surface-50'
              }`}
            >
              <input
                type="radio"
                name="exportType"
                value={option.id}
                checked={exportType === option.id}
                onChange={(e) => setExportType(e.target.value)}
                className="sr-only"
              />
              <Icon name={option.icon} size={16} className="text-primary-500 mr-3" />
              <div className="flex-1">
                <div className="text-sm font-medium text-text-primary">{option.label}</div>
                <div className="text-xs text-text-secondary">{option.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Optimization Settings */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-3">Optimization</h4>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={optimizationSettings?.minify || false}
              onChange={(e) => onOptimizationChange?.({ ...optimizationSettings, minify: e.target.checked })}
              className="rounded border-border text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-text-primary">Minify code</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={optimizationSettings?.removeComments || false}
              onChange={(e) => onOptimizationChange?.({ ...optimizationSettings, removeComments: e.target.checked })}
              className="rounded border-border text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-text-primary">Remove comments</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={optimizationSettings?.generateTypes || false}
              onChange={(e) => onOptimizationChange?.({ ...optimizationSettings, generateTypes: e.target.checked })}
              className="rounded border-border text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-text-primary">Generate TypeScript types</span>
          </label>
        </div>
      </div>

      {/* Export Actions */}
      <div className="space-y-3">
        <Button
          onClick={() => handleExport(exportType)}
          loading={isExporting}
          fullWidth
          variant="primary"
          iconName="Download"
          iconSize={16}
        >
          Export {exportOptions.find(opt => opt.id === exportType)?.label}
        </Button>

        <Button
          onClick={handleShare}
          fullWidth
          variant="secondary"
          iconName="Share"
          iconSize={16}
        >
          Generate Share Link
        </Button>
      </div>

      {/* Integration Options */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-3">Quick Integration</h4>
        <div className="grid grid-cols-2 gap-2">
          {integrationOptions.map(integration => (
            <Button
              key={integration.id}
              onClick={() => handleIntegration(integration.id)}
              variant="outline"
              size="sm"
              iconName={integration.icon}
              iconSize={14}
            >
              {integration.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Share Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">Share Project</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShareModalOpen(false)}
                iconName="X"
                iconSize={16}
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Share URL
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-border rounded-md bg-surface-50 text-sm"
                  />
                  <Button
                    onClick={copyShareUrl}
                    variant="outline"
                    size="sm"
                    iconName="Copy"
                    iconSize={14}
                  >
                    Copy
                  </Button>
                </div>
              </div>
              
              <div className="text-xs text-text-muted">
                This link will be valid for 30 days and allows others to view and download your generated code.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportControls;