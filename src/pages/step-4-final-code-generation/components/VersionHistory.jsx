import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VersionHistory = ({ onVersionRestore, currentVersion }) => {
  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    // Load version history from localStorage
    const savedVersions = localStorage.getItem('stepBuilderPro_versionHistory');
    if (savedVersions) {
      try {
        const parsedVersions = JSON.parse(savedVersions);
        setVersions(parsedVersions);
      } catch (error) {
        console.error('Failed to load version history:', error);
      }
    } else {
      // Create initial version history for demo
      const initialVersions = [
        {
          id: 'v1.0.0',
          name: 'Initial Generation',
          timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          description: 'First code generation with basic configuration',
          changes: ['Initial React component setup', 'Basic CSS styling', 'Component structure'],
          size: 2450,
          format: 'react',
          author: 'Step Builder Pro'
        },
        {
          id: 'v1.1.0',
          name: 'Added Styling',
          timestamp: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
          description: 'Enhanced CSS styling and responsive design',
          changes: ['Added mobile responsiveness', 'Updated color scheme', 'Improved typography'],
          size: 3120,
          format: 'react',
          author: 'Step Builder Pro'
        },
        {
          id: 'v1.2.0',
          name: 'Feature Enhancement',
          timestamp: new Date(Date.now() - 21600000).toISOString(), // 6 hours ago
          description: 'Added interactive elements and animations',
          changes: ['Added hover effects', 'Implemented animations', 'Enhanced user interactions'],
          size: 3680,
          format: 'react',
          author: 'Step Builder Pro'
        },
        {
          id: 'v1.3.0',
          name: 'Current Version',
          timestamp: new Date().toISOString(),
          description: 'Latest generation with all optimizations',
          changes: ['Code optimization', 'Performance improvements', 'Bug fixes'],
          size: 3420,
          format: 'react',
          author: 'Step Builder Pro',
          isCurrent: true
        }
      ];
      setVersions(initialVersions);
      localStorage.setItem('stepBuilderPro_versionHistory', JSON.stringify(initialVersions));
    }
  }, []);

  const saveCurrentVersion = () => {
    const newVersion = {
      id: `v1.${versions.length}.0`,
      name: `Version ${versions.length + 1}`,
      timestamp: new Date().toISOString(),
      description: 'Manual save point',
      changes: ['Manual save'],
      size: Math.floor(Math.random() * 2000) + 2000,
      format: currentVersion?.format || 'react',
      author: 'Step Builder Pro'
    };

    const updatedVersions = versions.map(v => ({ ...v, isCurrent: false }));
    updatedVersions.push({ ...newVersion, isCurrent: true });
    
    setVersions(updatedVersions);
    localStorage.setItem('stepBuilderPro_versionHistory', JSON.stringify(updatedVersions));
  };

  const handleVersionSelect = (version) => {
    setSelectedVersion(selectedVersion?.id === version.id ? null : version);
  };

  const handleRestore = (version) => {
    if (window.confirm(`Are you sure you want to restore to ${version.name}? This will overwrite your current version.`)) {
      const updatedVersions = versions.map(v => ({
        ...v,
        isCurrent: v.id === version.id
      }));
      
      setVersions(updatedVersions);
      localStorage.setItem('stepBuilderPro_versionHistory', JSON.stringify(updatedVersions));
      onVersionRestore?.(version);
    }
  };

  const handleDelete = (version) => {
    if (version.isCurrent) {
      alert('Cannot delete the current version');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${version.name}?`)) {
      const updatedVersions = versions.filter(v => v.id !== version.id);
      setVersions(updatedVersions);
      localStorage.setItem('stepBuilderPro_versionHistory', JSON.stringify(updatedVersions));
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getVersionIcon = (version) => {
    if (version.isCurrent) return 'CheckCircle';
    return 'Circle';
  };

  const getVersionColor = (version) => {
    if (version.isCurrent) return 'text-success-600';
    return 'text-text-muted';
  };

  const sortedVersions = [...versions].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="h-full bg-surface border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-surface-50">
        <div className="flex items-center space-x-2">
          <Icon name="History" size={16} className="text-text-secondary" />
          <span className="font-medium text-text-primary">Version History</span>
          <span className="text-xs bg-secondary-100 text-text-muted px-2 py-0.5 rounded-full">
            {versions.length}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComparison(!showComparison)}
            iconName="GitCompare"
            iconSize={14}
          >
            Compare
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={saveCurrentVersion}
            iconName="Save"
            iconSize={14}
          >
            Save Version
          </Button>
        </div>
      </div>

      {/* Version List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-3">
          {sortedVersions.map((version) => (
            <div
              key={version.id}
              className={`border rounded-lg transition-all duration-200 ${
                selectedVersion?.id === version.id
                  ? 'border-primary-200 bg-primary-50'
                  : version.isCurrent
                  ? 'border-success-200 bg-success-50' :'border-border bg-surface-50 hover:bg-surface-100'
              }`}
            >
              <div
                className="p-4 cursor-pointer"
                onClick={() => handleVersionSelect(version)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <Icon 
                      name={getVersionIcon(version)} 
                      size={16} 
                      className={getVersionColor(version)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium text-text-primary">
                          {version.name}
                        </h4>
                        <span className="text-xs text-text-muted">
                          {version.id}
                        </span>
                        {version.isCurrent && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-text-muted mt-1">
                        {version.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-text-muted">
                        <span>{new Date(version.timestamp).toLocaleString()}</span>
                        <span>{formatFileSize(version.size)}</span>
                        <span className="capitalize">{version.format}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 ml-2">
                    {!version.isCurrent && (
                      <>
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRestore(version);
                          }}
                          iconName="RotateCcw"
                          iconSize={12}
                          title="Restore this version"
                        />
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(version);
                          }}
                          iconName="Trash2"
                          iconSize={12}
                          title="Delete this version"
                          className="text-error-600 hover:text-error-700"
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedVersion?.id === version.id && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="space-y-3">
                      <div>
                        <h5 className="text-xs font-medium text-text-primary mb-2">Changes</h5>
                        <ul className="space-y-1">
                          {version.changes?.map((change, index) => (
                            <li key={index} className="flex items-center space-x-2 text-xs text-text-secondary">
                              <Icon name="GitCommit" size={12} className="text-text-muted" />
                              <span>{change}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-text-muted">Author:</span>
                          <div className="font-medium text-text-primary">{version.author}</div>
                        </div>
                        <div>
                          <span className="text-text-muted">Format:</span>
                          <div className="font-medium text-text-primary capitalize">{version.format}</div>
                        </div>
                      </div>

                      {!version.isCurrent && (
                        <div className="flex items-center space-x-2 pt-2">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleRestore(version)}
                            iconName="RotateCcw"
                            iconSize={14}
                          >
                            Restore Version
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {/* Download version */}}
                            iconName="Download"
                            iconSize={14}
                          >
                            Download
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {versions.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-text-muted">
            <Icon name="History" size={48} className="mb-4" />
            <h3 className="text-lg font-medium mb-2">No Version History</h3>
            <p className="text-sm text-center max-w-xs">
              Your version history will appear here as you save different generations of your project.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border bg-surface-50">
        <div className="flex items-center justify-between text-xs text-text-muted">
          <span>Total versions: {versions.length}</span>
          <span>Auto-save enabled</span>
        </div>
      </div>
    </div>
  );
};

export default VersionHistory;