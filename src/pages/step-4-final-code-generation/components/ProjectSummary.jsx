import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProjectSummary = ({ projectData, onExportSummary }) => {
  const [expandedSections, setExpandedSections] = useState({
    configuration: true,
    assets: false,
    styles: false,
    statistics: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getSummaryData = () => {
    // Load data from localStorage to create summary
    const config = JSON.parse(localStorage.getItem('stepBuilderPro_step1_configData') || '{}');
    const svgData = JSON.parse(localStorage.getItem('stepBuilderPro_step2_svgData') || '{}');
    const cssData = JSON.parse(localStorage.getItem('stepBuilderPro_step3_cssData') || '{}');
    const completedSteps = JSON.parse(localStorage.getItem('stepBuilderPro_completedSteps') || '[]');

    return {
      configuration: {
        framework: config.selectedFramework || 'React',
        styling: config.stylingApproach || 'Tailwind CSS',
        buildTool: config.buildTool || 'Vite',
        responsive: config.responsiveDesign || true,
        accessibility: config.accessibility || true
      },
      assets: {
        svgElements: svgData.elements?.length || 0,
        customShapes: svgData.customShapes?.length || 0,
        icons: svgData.icons?.length || 0,
        totalAssets: (svgData.elements?.length || 0) + (svgData.customShapes?.length || 0) + (svgData.icons?.length || 0)
      },
      styles: {
        framework: cssData.selectedFramework || 'vanilla',
        customProperties: Object.keys(cssData.customProperties || {}).length,
        cssLines: cssData.cssCode?.split('\n').length || 0,
        mediaQueries: (cssData.cssCode?.match(/@media/g) || []).length
      },
      statistics: {
        completedSteps: completedSteps.length,
        totalSteps: 4,
        projectSize: Math.round((JSON.stringify(config).length + JSON.stringify(svgData).length + JSON.stringify(cssData).length) / 1024) + 'KB',
        estimatedBuildTime: '2-5 minutes'
      }
    };
  };

  const summaryData = getSummaryData();

  const renderConfigurationSection = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-surface-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <Icon name="Settings" size={14} className="text-primary-500" />
            <span className="text-xs font-medium text-text-secondary">Framework</span>
          </div>
          <div className="text-sm font-semibold text-text-primary">
            {summaryData.configuration.framework}
          </div>
        </div>
        <div className="p-3 bg-surface-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <Icon name="Palette" size={14} className="text-accent-500" />
            <span className="text-xs font-medium text-text-secondary">Styling</span>
          </div>
          <div className="text-sm font-semibold text-text-primary">
            {summaryData.configuration.styling}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-surface-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <Icon name="Zap" size={14} className="text-warning-500" />
            <span className="text-xs font-medium text-text-secondary">Build Tool</span>
          </div>
          <div className="text-sm font-semibold text-text-primary">
            {summaryData.configuration.buildTool}
          </div>
        </div>
        <div className="p-3 bg-surface-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <Icon name="Smartphone" size={14} className="text-success-500" />
            <span className="text-xs font-medium text-text-secondary">Responsive</span>
          </div>
          <div className="text-sm font-semibold text-text-primary">
            {summaryData.configuration.responsive ? 'Enabled' : 'Disabled'}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAssetsSection = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center p-3 bg-surface-50 rounded-lg">
          <div className="text-lg font-bold text-primary-600">
            {summaryData.assets.svgElements}
          </div>
          <div className="text-xs text-text-secondary">SVG Elements</div>
        </div>
        <div className="text-center p-3 bg-surface-50 rounded-lg">
          <div className="text-lg font-bold text-accent-600">
            {summaryData.assets.customShapes}
          </div>
          <div className="text-xs text-text-secondary">Custom Shapes</div>
        </div>
        <div className="text-center p-3 bg-surface-50 rounded-lg">
          <div className="text-lg font-bold text-success-600">
            {summaryData.assets.icons}
          </div>
          <div className="text-xs text-text-secondary">Icons</div>
        </div>
      </div>
      
      <div className="p-3 bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg border border-primary-100">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-text-primary">Total Assets</span>
          <span className="text-lg font-bold text-primary-600">
            {summaryData.assets.totalAssets}
          </span>
        </div>
      </div>
    </div>
  );

  const renderStylesSection = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-surface-50 rounded-lg">
          <div className="text-sm text-text-secondary mb-1">CSS Framework</div>
          <div className="font-semibold text-text-primary capitalize">
            {summaryData.styles.framework}
          </div>
        </div>
        <div className="p-3 bg-surface-50 rounded-lg">
          <div className="text-sm text-text-secondary mb-1">Custom Properties</div>
          <div className="font-semibold text-text-primary">
            {summaryData.styles.customProperties}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-surface-50 rounded-lg">
          <div className="text-sm text-text-secondary mb-1">CSS Lines</div>
          <div className="font-semibold text-text-primary">
            {summaryData.styles.cssLines}
          </div>
        </div>
        <div className="p-3 bg-surface-50 rounded-lg">
          <div className="text-sm text-text-secondary mb-1">Media Queries</div>
          <div className="font-semibold text-text-primary">
            {summaryData.styles.mediaQueries}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStatisticsSection = () => (
    <div className="space-y-3">
      <div className="p-4 bg-gradient-to-br from-success-50 to-primary-50 rounded-lg border border-success-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-success-800">Project Progress</span>
          <span className="text-sm font-bold text-success-600">
            {Math.round((summaryData.statistics.completedSteps / summaryData.statistics.totalSteps) * 100)}%
          </span>
        </div>
        <div className="w-full bg-success-100 rounded-full h-2">
          <div 
            className="bg-success-500 h-2 rounded-full transition-all duration-500"
            style={{ 
              width: `${(summaryData.statistics.completedSteps / summaryData.statistics.totalSteps) * 100}%` 
            }}
          />
        </div>
        <div className="text-xs text-success-700 mt-2">
          {summaryData.statistics.completedSteps} of {summaryData.statistics.totalSteps} steps completed
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-surface-50 rounded-lg">
          <div className="text-sm text-text-secondary mb-1">Project Size</div>
          <div className="font-semibold text-text-primary">
            {summaryData.statistics.projectSize}
          </div>
        </div>
        <div className="p-3 bg-surface-50 rounded-lg">
          <div className="text-sm text-text-secondary mb-1">Build Time</div>
          <div className="font-semibold text-text-primary">
            {summaryData.statistics.estimatedBuildTime}
          </div>
        </div>
      </div>
    </div>
  );

  const sections = [
    {
      key: 'configuration',
      title: 'Configuration Overview',
      icon: 'Settings',
      content: renderConfigurationSection
    },
    {
      key: 'assets',
      title: 'SVG Assets Used',
      icon: 'Image',
      content: renderAssetsSection
    },
    {
      key: 'styles',
      title: 'CSS Properties Applied',
      icon: 'Palette',
      content: renderStylesSection
    },
    {
      key: 'statistics',
      title: 'Generation Statistics',
      icon: 'BarChart3',
      content: renderStatisticsSection
    }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">Project Summary</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onExportSummary}
            iconName="Download"
            iconSize={14}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {sections.map(section => (
          <div key={section.key} className="border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection(section.key)}
              className="w-full flex items-center justify-between p-3 bg-surface-50 hover:bg-surface text-left transition-colors duration-200"
            >
              <div className="flex items-center space-x-2">
                <Icon name={section.icon} size={16} className="text-primary-500" />
                <span className="font-medium text-text-primary">{section.title}</span>
              </div>
              <Icon 
                name="ChevronDown" 
                size={16} 
                className={`text-text-secondary transition-transform duration-200 ${
                  expandedSections[section.key] ? 'rotate-180' : ''
                }`} 
              />
            </button>
            
            {expandedSections[section.key] && (
              <div className="p-4 bg-surface">
                {section.content()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectSummary;