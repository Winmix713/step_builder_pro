import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import CodeViewer from './CodeViewer';
import ProjectSidebar from './ProjectSidebar';
import ExportToolbar from './ExportToolbar';
import VersionHistory from './VersionHistory';
import SharingPanel from './SharingPanel';

const MobileCodeInterface = ({ 
  generatedCode, 
  activeFormat, 
  onFormatChange, 
  projectData,
  onExport,
  onOptimize,
  onShare,
  onVersionRestore
}) => {
  const [activeTab, setActiveTab] = useState('code');
  const [expandedSection, setExpandedSection] = useState(null);

  const tabs = [
    { id: 'code', label: 'Code', icon: 'Code', component: CodeViewer },
    { id: 'export', label: 'Export', icon: 'Download', component: ExportToolbar },
    { id: 'project', label: 'Project', icon: 'Folder', component: ProjectSidebar },
    { id: 'versions', label: 'History', icon: 'History', component: VersionHistory },
    { id: 'share', label: 'Share', icon: 'Share2', component: SharingPanel }
  ];

  const expandableSections = [
    {
      id: 'summary',
      title: 'Project Summary',
      icon: 'Info',
      content: (
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-text-muted">Framework</span>
              <div className="font-medium text-text-primary">React</div>
            </div>
            <div>
              <span className="text-text-muted">Components</span>
              <div className="font-medium text-text-primary">3</div>
            </div>
          </div>
          <div className="p-3 bg-surface-50 rounded-md">
            <div className="text-xs text-text-muted mb-1">Status</div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success-500 rounded-full" />
              <span className="text-sm text-text-primary">Ready for export</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'assets',
      title: 'Assets Used',
      icon: 'Package',
      content: (
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-surface-50 rounded-md">
              <div className="text-lg font-bold text-primary-600">2</div>
              <div className="text-xs text-text-muted">SVG Assets</div>
            </div>
            <div className="text-center p-3 bg-surface-50 rounded-md">
              <div className="text-lg font-bold text-accent-600">15</div>
              <div className="text-xs text-text-muted">CSS Rules</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'stats',
      title: 'Generation Statistics',
      icon: 'BarChart',
      content: (
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-muted">Lines of Code</span>
            <span className="font-medium text-text-primary">342</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-muted">File Size</span>
            <span className="font-medium text-text-primary">12.4 KB</span>
          </div>
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-text-muted">Optimization</span>
              <span className="font-medium text-text-primary">85%</span>
            </div>
            <div className="w-full bg-secondary-100 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-success-500 to-primary-500 h-2 rounded-full"
                style={{ width: '85%' }}
              />
            </div>
          </div>
        </div>
      )
    }
  ];

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const renderTabContent = () => {
    const activeTabConfig = tabs.find(tab => tab.id === activeTab);
    if (!activeTabConfig) return null;

    const TabComponent = activeTabConfig.component;
    const props = {
      generatedCode,
      activeFormat,
      onFormatChange,
      projectData,
      onExport,
      onOptimize,
      onShare,
      onVersionRestore
    };

    return <TabComponent {...props} />;
  };

  return (
    <div className="flex flex-col h-full bg-surface">
      {/* Expandable Sections */}
      <div className="border-b border-border">
        {expandableSections.map((section) => (
          <div key={section.id} className="border-b border-border last:border-b-0">
            <button
              onClick={() => toggleSection(section.id)}
              className="flex items-center justify-between w-full p-4 text-left hover:bg-surface-50 transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <Icon name={section.icon} size={16} className="text-text-secondary" />
                <span className="font-medium text-text-primary">{section.title}</span>
              </div>
              <Icon 
                name={expandedSection === section.id ? "ChevronUp" : "ChevronDown"} 
                size={16} 
                className="text-text-muted" 
              />
            </button>
            
            {expandedSection === section.id && (
              <div className="border-t border-border bg-surface-50">
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto bg-surface-50 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-200 ${
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600 bg-primary-50' :'border-transparent text-text-secondary hover:text-text-primary hover:bg-surface'
            }`}
          >
            <Icon name={tab.icon} size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {renderTabContent()}
      </div>

      {/* Quick Actions Bar */}
      <div className="flex items-center justify-between p-3 border-t border-border bg-surface-50">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success-500 rounded-full" />
          <span className="text-xs text-text-muted">Ready to export</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onExport?.('clipboard')}
            className="flex items-center space-x-1 px-2 py-1 text-xs text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded transition-colors duration-200"
          >
            <Icon name="Copy" size={12} />
            <span>Copy</span>
          </button>
          
          <button
            onClick={() => onExport?.('zip')}
            className="flex items-center space-x-1 px-3 py-1 text-xs bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors duration-200"
          >
            <Icon name="Download" size={12} />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Format Selection Mini Bar (when on code tab) */}
      {activeTab === 'code' && (
        <div className="flex overflow-x-auto p-2 border-t border-border bg-surface space-x-1">
          {['react', 'html', 'vue', 'angular', 'vanilla'].map((format) => (
            <button
              key={format}
              onClick={() => onFormatChange?.(format)}
              className={`px-3 py-1 text-xs font-medium whitespace-nowrap rounded transition-colors duration-200 ${
                activeFormat === format
                  ? 'bg-primary-100 text-primary-700' :'text-text-secondary hover:text-text-primary hover:bg-surface-50'
              }`}
            >
              {format.charAt(0).toUpperCase() + format.slice(1)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileCodeInterface;