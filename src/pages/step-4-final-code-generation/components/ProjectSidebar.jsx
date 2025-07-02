import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const ProjectSidebar = ({ projectData, generationStats, onConfigChange }) => {
  const [expandedSections, setExpandedSections] = useState({
    summary: true,
    config: true,
    assets: true,
    stats: true
  });

  const [projectInfo, setProjectInfo] = useState(() => {
    const saved = localStorage.getItem('stepBuilderPro_projectContext');
    return saved ? JSON.parse(saved) : {
      name: 'Untitled Project',
      description: '',
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
  });

  const [configOverview, setConfigOverview] = useState(() => {
    // Combine configuration from all steps
    const step1Data = localStorage.getItem('stepBuilderPro_step1_configData');
    const step2Data = localStorage.getItem('stepBuilderPro_step2_svgData');
    const step3Data = localStorage.getItem('stepBuilderPro_step3_cssData');

    const configs = {
      step1: step1Data ? JSON.parse(step1Data) : null,
      step2: step2Data ? JSON.parse(step2Data) : null,
      step3: step3Data ? JSON.parse(step3Data) : null
    };

    return configs;
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getAssetsSummary = () => {
    const svgAssets = configOverview.step2?.svgElements || [];
    const cssProperties = configOverview.step3?.cssCode ? 
      configOverview.step3.cssCode.match(/[^{}]+(?=\s*{)/g)?.length || 0 : 0;
    const jsComponents = configOverview.step1?.selectedFramework === 'react' ? 
      ['GeneratedComponent', 'App', 'index'] : [];

    return {
      svgAssets: svgAssets.length,
      cssSelectors: cssProperties,
      jsComponents: jsComponents.length,
      totalFiles: svgAssets.length + 2 + jsComponents.length
    };
  };

  const getGenerationMetrics = () => {
    return {
      codeLines: generationStats?.totalLines || 0,
      fileSize: generationStats?.totalSize || 0,
      complexity: generationStats?.complexity || 'Medium',
      optimizationScore: generationStats?.optimizationScore || 85,
      lastGenerated: new Date().toLocaleString(),
      buildTime: generationStats?.buildTime || '2.3s'
    };
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const assets = getAssetsSummary();
  const metrics = getGenerationMetrics();

  const SectionHeader = ({ title, icon, section, count }) => (
    <button
      onClick={() => toggleSection(section)}
      className="flex items-center justify-between w-full p-3 text-left hover:bg-surface-50 transition-colors duration-200"
    >
      <div className="flex items-center space-x-2">
        <Icon name={icon} size={16} className="text-text-secondary" />
        <span className="font-medium text-text-primary">{title}</span>
        {count !== undefined && (
          <span className="text-xs bg-secondary-100 text-text-muted px-2 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </div>
      <Icon 
        name={expandedSections[section] ? "ChevronUp" : "ChevronDown"} 
        size={16} 
        className="text-text-muted" 
      />
    </button>
  );

  return (
    <div className="h-full bg-surface border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-surface-50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
            <Icon name="FileText" size={16} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-text-primary truncate">
              {projectInfo.name}
            </h3>
            <p className="text-xs text-text-muted">
              v{projectInfo.version} • Generated Project
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Project Summary */}
        <div className="border-b border-border">
          <SectionHeader 
            title="Project Summary" 
            icon="Info" 
            section="summary" 
          />
          {expandedSections.summary && (
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-text-muted">Created</span>
                  <div className="font-medium text-text-primary">
                    {new Date(projectInfo.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <span className="text-text-muted">Modified</span>
                  <div className="font-medium text-text-primary">
                    {new Date(projectInfo.lastModified).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-surface-50 rounded-md">
                <div className="text-xs text-text-muted mb-1">Description</div>
                <p className="text-sm text-text-primary">
                  {projectInfo.description || 'No description provided'}
                </p>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Framework</span>
                <span className="font-medium text-text-primary capitalize">
                  {configOverview.step1?.selectedFramework || 'React'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Configuration Overview */}
        <div className="border-b border-border">
          <SectionHeader 
            title="Configuration" 
            icon="Settings" 
            section="config" 
          />
          {expandedSections.config && (
            <div className="p-4 space-y-3">
              {/* Step 1 Configuration */}
              {configOverview.step1 && (
                <div className="p-3 bg-primary-50 rounded-md border border-primary-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Settings" size={14} className="text-primary-600" />
                    <span className="text-sm font-medium text-primary-700">Step 1: Configuration</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Framework:</span>
                      <span className="text-text-primary capitalize">
                        {configOverview.step1.selectedFramework || 'React'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Build Tool:</span>
                      <span className="text-text-primary">
                        {configOverview.step1.buildTool || 'Vite'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2 SVG Configuration */}
              {configOverview.step2 && (
                <div className="p-3 bg-accent-50 rounded-md border border-accent-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Image" size={14} className="text-accent-600" />
                    <span className="text-sm font-medium text-accent-700">Step 2: SVG Assets</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Elements:</span>
                      <span className="text-text-primary">
                        {configOverview.step2.svgElements?.length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Canvas Size:</span>
                      <span className="text-text-primary">
                        {configOverview.step2.canvasSize || '800x600'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3 CSS Configuration */}
              {configOverview.step3 && (
                <div className="p-3 bg-success-50 rounded-md border border-success-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Palette" size={14} className="text-success-600" />
                    <span className="text-sm font-medium text-success-700">Step 3: CSS Styling</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Framework:</span>
                      <span className="text-text-primary capitalize">
                        {configOverview.step3.selectedFramework || 'Vanilla'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Code Size:</span>
                      <span className="text-text-primary">
                        {configOverview.step3.cssCode?.length || 0} chars
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Assets Summary */}
        <div className="border-b border-border">
          <SectionHeader 
            title="Assets Used" 
            icon="Package" 
            section="assets" 
            count={assets.totalFiles}
          />
          {expandedSections.assets && (
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-surface-50 rounded-md">
                  <div className="text-lg font-bold text-primary-600">{assets.svgAssets}</div>
                  <div className="text-xs text-text-muted">SVG Assets</div>
                </div>
                <div className="text-center p-3 bg-surface-50 rounded-md">
                  <div className="text-lg font-bold text-accent-600">{assets.cssSelectors}</div>
                  <div className="text-xs text-text-muted">CSS Selectors</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Icon name="FileText" size={14} className="text-text-muted" />
                    <span className="text-text-secondary">Components</span>
                  </div>
                  <span className="font-medium text-text-primary">{assets.jsComponents}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Icon name="Folder" size={14} className="text-text-muted" />
                    <span className="text-text-secondary">Total Files</span>
                  </div>
                  <span className="font-medium text-text-primary">{assets.totalFiles}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Generation Statistics */}
        <div>
          <SectionHeader 
            title="Generation Stats" 
            icon="BarChart" 
            section="stats" 
          />
          {expandedSections.stats && (
            <div className="p-4 space-y-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">Lines of Code</span>
                  <span className="font-medium text-text-primary">{metrics.codeLines.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">File Size</span>
                  <span className="font-medium text-text-primary">{formatFileSize(metrics.fileSize)}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">Complexity</span>
                  <span className={`font-medium ${
                    metrics.complexity === 'Low' ? 'text-success-600' :
                    metrics.complexity === 'Medium' ? 'text-warning-600' : 'text-error-600'
                  }`}>
                    {metrics.complexity}
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-text-muted">Optimization</span>
                    <span className="font-medium text-text-primary">{metrics.optimizationScore}%</span>
                  </div>
                  <div className="w-full bg-secondary-100 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-success-500 to-primary-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${metrics.optimizationScore}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-border text-xs text-text-muted">
                  <div className="flex justify-between">
                    <span>Last Generated:</span>
                    <span>{metrics.lastGenerated}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Build Time:</span>
                    <span>{metrics.buildTime}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectSidebar;