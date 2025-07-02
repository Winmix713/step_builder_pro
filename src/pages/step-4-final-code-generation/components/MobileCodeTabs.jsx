import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import CodeViewer from './CodeViewer';
import ProjectSummary from './ProjectSummary';
import ExportControls from './ExportControls';
import VersionHistory from './VersionHistory';

const MobileCodeTabs = ({ 
  generatedCode, 
  selectedFormat, 
  onFormatChange, 
  onCopy, 
  onDownload,
  onExport,
  onShare,
  optimizationSettings,
  onOptimizationChange,
  onVersionSelect
}) => {
  const [activeTab, setActiveTab] = useState('code');

  const tabs = [
    { id: 'code', label: 'Code', icon: 'Code', component: CodeViewer },
    { id: 'summary', label: 'Summary', icon: 'FileText', component: ProjectSummary },
    { id: 'export', label: 'Export', icon: 'Download', component: ExportControls },
    { id: 'versions', label: 'Versions', icon: 'History', component: VersionHistory }
  ];

  const renderActiveTabContent = () => {
    const activeTabData = tabs.find(tab => tab.id === activeTab);
    if (!activeTabData) return null;

    const Component = activeTabData.component;

    switch (activeTab) {
      case 'code':
        return (
          <Component
            generatedCode={generatedCode}
            selectedFormat={selectedFormat}
            onFormatChange={onFormatChange}
            onCopy={onCopy}
            onDownload={onDownload}
          />
        );
      case 'summary':
        return (
          <Component
            onExportSummary={() => console.log('Export summary')}
          />
        );
      case 'export':
        return (
          <Component
            generatedCode={generatedCode}
            onExport={onExport}
            onShare={onShare}
            selectedFormat={selectedFormat}
            optimizationSettings={optimizationSettings}
            onOptimizationChange={onOptimizationChange}
          />
        );
      case 'versions':
        return (
          <Component
            onVersionSelect={onVersionSelect}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Tab Navigation */}
      <div className="flex bg-surface border-b border-border overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
              activeTab === tab.id
                ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50' :'text-text-secondary hover:text-text-primary hover:bg-surface-50'
            }`}
          >
            <Icon name={tab.icon} size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {renderActiveTabContent()}
      </div>

      {/* Tab Status Indicators */}
      <div className="p-3 border-t border-border bg-surface-50">
        <div className="flex items-center justify-between text-xs text-text-muted">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-success-500" />
              <span>Code Generated</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-primary-500" />
              <span>{selectedFormat.toUpperCase()}</span>
            </div>
          </div>
          <div className="text-right">
            Active: {tabs.find(tab => tab.id === activeTab)?.label}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileCodeTabs;