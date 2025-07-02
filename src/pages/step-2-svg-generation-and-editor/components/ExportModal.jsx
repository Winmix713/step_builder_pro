import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ExportModal = ({ 
  isOpen, 
  onClose, 
  elements = [], 
  canvasSize = { width: 800, height: 600 },
  currentLanguage = 'en' 
}) => {
  const [exportSettings, setExportSettings] = useState({
    format: 'svg',
    quality: 'high',
    includeBackground: true,
    optimizeCode: true,
    width: canvasSize.width,
    height: canvasSize.height,
    scale: 1,
    filename: 'my-svg-design'
  });

  const [isExporting, setIsExporting] = useState(false);

  const formatOptions = [
    { id: 'svg', name: 'SVG', description: 'Vector format, scalable', icon: 'FileImage' },
    { id: 'png', name: 'PNG', description: 'Raster format, transparent background', icon: 'Image' },
    { id: 'jpg', name: 'JPG', description: 'Raster format, smaller file size', icon: 'Image' },
    { id: 'pdf', name: 'PDF', description: 'Document format, print-ready', icon: 'FileText' }
  ];

  const qualityOptions = [
    { id: 'low', name: 'Low', description: 'Smaller file size' },
    { id: 'medium', name: 'Medium', description: 'Balanced quality and size' },
    { id: 'high', name: 'High', description: 'Best quality, larger file' }
  ];

  const handleSettingChange = (key, value) => {
    setExportSettings(prev => ({ ...prev, [key]: value }));
  };

  const generateSVGContent = () => {
    const { width, height } = exportSettings;
    let svgContent = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`;
    
    if (exportSettings.includeBackground) {
      svgContent += `\n  <rect width="100%" height="100%" fill="white"/>`;
    }
    
    elements.forEach(element => {
      if (element.properties?.visible !== false) {
        svgContent += `\n  <g transform="translate(${element.x}, ${element.y})">`;
        svgContent += `\n    ${element.svg}`;
        svgContent += `\n  </g>`;
      }
    });
    
    svgContent += '\n</svg>';
    return svgContent;
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const svgContent = generateSVGContent();
      
      if (exportSettings.format === 'svg') {
        // Direct SVG export
        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        downloadFile(blob, `${exportSettings.filename}.svg`);
      } else {
        // Convert to raster format
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        canvas.width = exportSettings.width * exportSettings.scale;
        canvas.height = exportSettings.height * exportSettings.scale;
        
        const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(svgBlob);
        
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          const quality = exportSettings.quality === 'high' ? 0.95 : 
                         exportSettings.quality === 'medium' ? 0.8 : 0.6;
          
          canvas.toBlob((blob) => {
            downloadFile(blob, `${exportSettings.filename}.${exportSettings.format}`);
            URL.revokeObjectURL(url);
          }, `image/${exportSettings.format}`, quality);
        };
        
        img.src = url;
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const downloadFile = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyToClipboard = () => {
    const svgContent = generateSVGContent();
    navigator.clipboard.writeText(svgContent).then(() => {
      // Could show success toast
      console.log('SVG code copied to clipboard');
    });
  };

  const getFileSizeEstimate = () => {
    const svgContent = generateSVGContent();
    const sizeInBytes = new Blob([svgContent]).size;
    const sizeInKB = Math.round(sizeInBytes / 1024);
    return sizeInKB < 1 ? '< 1 KB' : `${sizeInKB} KB`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-surface rounded-lg shadow-elevation-3 w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Icon name="Download" size={20} className="text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Export Design</h2>
              <p className="text-sm text-text-secondary">Choose format and settings for your SVG</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface-50 rounded-lg transition-colors duration-200"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Format Selection */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-3">Export Format</label>
              <div className="grid grid-cols-2 gap-3">
                {formatOptions.map((format) => (
                  <button
                    key={format.id}
                    onClick={() => handleSettingChange('format', format.id)}
                    className={`p-4 border rounded-lg text-left transition-all duration-200 ${
                      exportSettings.format === format.id
                        ? 'border-primary-500 bg-primary-50' :'border-border hover:border-primary-200 hover:bg-surface-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon 
                        name={format.icon} 
                        size={20} 
                        className={exportSettings.format === format.id ? 'text-primary-600' : 'text-text-secondary'} 
                      />
                      <div>
                        <div className={`font-medium ${
                          exportSettings.format === format.id ? 'text-primary-700' : 'text-text-primary'
                        }`}>
                          {format.name}
                        </div>
                        <div className="text-xs text-text-muted">{format.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quality Settings */}
            {exportSettings.format !== 'svg' && (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-3">Quality</label>
                <div className="space-y-2">
                  {qualityOptions.map((quality) => (
                    <label key={quality.id} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="quality"
                        value={quality.id}
                        checked={exportSettings.quality === quality.id}
                        onChange={(e) => handleSettingChange('quality', e.target.value)}
                        className="text-primary-600"
                      />
                      <div>
                        <div className="text-sm font-medium text-text-primary">{quality.name}</div>
                        <div className="text-xs text-text-muted">{quality.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Dimensions */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-3">Dimensions</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-text-secondary mb-1">Width</label>
                  <Input
                    type="number"
                    value={exportSettings.width}
                    onChange={(e) => handleSettingChange('width', parseInt(e.target.value))}
                    min="1"
                    max="4000"
                  />
                </div>
                <div>
                  <label className="block text-xs text-text-secondary mb-1">Height</label>
                  <Input
                    type="number"
                    value={exportSettings.height}
                    onChange={(e) => handleSettingChange('height', parseInt(e.target.value))}
                    min="1"
                    max="4000"
                  />
                </div>
              </div>
              
              {exportSettings.format !== 'svg' && (
                <div className="mt-3">
                  <label className="block text-xs text-text-secondary mb-1">Scale Factor</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="0.5"
                      max="3"
                      step="0.1"
                      value={exportSettings.scale}
                      onChange={(e) => handleSettingChange('scale', parseFloat(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm text-text-primary min-w-[40px]">{exportSettings.scale}x</span>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Options */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-3">Options</label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exportSettings.includeBackground}
                    onChange={(e) => handleSettingChange('includeBackground', e.target.checked)}
                    className="rounded"
                  />
                  <div>
                    <div className="text-sm text-text-primary">Include background</div>
                    <div className="text-xs text-text-muted">Add white background to the export</div>
                  </div>
                </label>
                
                {exportSettings.format === 'svg' && (
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportSettings.optimizeCode}
                      onChange={(e) => handleSettingChange('optimizeCode', e.target.checked)}
                      className="rounded"
                    />
                    <div>
                      <div className="text-sm text-text-primary">Optimize code</div>
                      <div className="text-xs text-text-muted">Remove unnecessary attributes and whitespace</div>
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* Filename */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Filename</label>
              <Input
                type="text"
                value={exportSettings.filename}
                onChange={(e) => handleSettingChange('filename', e.target.value)}
                placeholder="my-svg-design"
              />
            </div>

            {/* Preview Info */}
            <div className="bg-surface-50 rounded-lg p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Estimated file size:</span>
                <span className="font-medium text-text-primary">{getFileSizeEstimate()}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-text-secondary">Elements to export:</span>
                <span className="font-medium text-text-primary">
                  {elements.filter(el => el.properties?.visible !== false).length} of {elements.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-surface-50">
          <div className="flex items-center space-x-2">
            {exportSettings.format === 'svg' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyToClipboard}
                iconName="Copy"
                iconSize={16}
              >
                Copy Code
              </Button>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleExport}
              loading={isExporting}
              iconName="Download"
              iconSize={16}
            >
              Export {exportSettings.format.toUpperCase()}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;