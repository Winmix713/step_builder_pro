import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const ConfigurationForm = ({ 
  configuration, 
  onConfigurationChange, 
  validationErrors, 
  onValidate,
  isValidating 
}) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [expandedSections, setExpandedSections] = useState({
    project: true,
    framework: false,
    styling: false,
    features: false,
    advanced: false
  });

  useEffect(() => {
    const savedLanguage = localStorage.getItem('stepBuilderPro_language');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const handleInputChange = (field, value) => {
    const updatedConfig = { ...configuration, [field]: value };
    onConfigurationChange(updatedConfig);
  };

  const handleNestedInputChange = (section, field, value) => {
    const updatedConfig = {
      ...configuration,
      [section]: {
        ...configuration[section],
        [field]: value
      }
    };
    onConfigurationChange(updatedConfig);
  };

  const renderSectionHeader = (key, title, description) => (
    <button
      onClick={() => toggleSection(key)}
      className="w-full flex items-center justify-between p-4 bg-surface-50 hover:bg-surface-100 transition-colors duration-200 rounded-lg border border-border"
    >
      <div className="flex items-center space-x-3">
        <Icon 
          name={expandedSections[key] ? "ChevronDown" : "ChevronRight"} 
          size={16} 
          className="text-text-secondary" 
        />
        <div className="text-left">
          <h3 className="text-sm font-medium text-text-primary">{title}</h3>
          <p className="text-xs text-text-muted mt-0.5">{description}</p>
        </div>
      </div>
      <div className={`w-2 h-2 rounded-full ${
        validationErrors[key] ? 'bg-error-500' : 'bg-success-500'
      }`} />
    </button>
  );

  const renderFormField = (field, label, type = 'text', options = null, helpText = null) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-text-primary">{label}</label>
        {helpText && (
          <div className="group relative">
            <Icon name="HelpCircle" size={14} className="text-text-muted cursor-help" />
            <div className="absolute right-0 top-6 w-48 p-2 bg-text-primary text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
              {helpText}
            </div>
          </div>
        )}
      </div>
      
      {type === 'select' ? (
        <select
          value={configuration[field] || ''}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-md bg-surface focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
        >
          <option value="">Select {label}</option>
          {options?.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === 'toggle' ? (
        <button
          onClick={() => handleInputChange(field, !configuration[field])}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
            configuration[field] ? 'bg-primary-500' : 'bg-secondary-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
              configuration[field] ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      ) : type === 'range' ? (
        <div className="space-y-2">
          <input
            type="range"
            min={options?.min || 0}
            max={options?.max || 100}
            value={configuration[field] || options?.min || 0}
            onChange={(e) => handleInputChange(field, parseInt(e.target.value))}
            className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-text-muted">
            <span>{options?.min || 0}</span>
            <span className="font-medium text-text-primary">{configuration[field] || options?.min || 0}</span>
            <span>{options?.max || 100}</span>
          </div>
        </div>
      ) : (
        <Input
          type={type}
          value={configuration[field] || ''}
          onChange={(e) => handleInputChange(field, e.target.value)}
          placeholder={`Enter ${label.toLowerCase()}`}
          className={validationErrors[field] ? 'border-error-500 focus:ring-error-500' : ''}
        />
      )}
      
      {validationErrors[field] && (
        <div className="flex items-center space-x-1 text-error-600">
          <Icon name="AlertCircle" size={12} />
          <span className="text-xs">{validationErrors[field]}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Project Settings */}
      <div className="space-y-3">
        {renderSectionHeader('project', 'Project Settings', 'Basic project configuration and metadata')}
        {expandedSections.project && (
          <div className="p-4 space-y-4 bg-surface border border-border rounded-lg">
            {renderFormField('projectName', 'Project Name', 'text', null, 'A unique name for your project')}
            {renderFormField('projectDescription', 'Description', 'text', null, 'Brief description of your project')}
            {renderFormField('version', 'Version', 'text', null, 'Semantic version (e.g., 1.0.0)')}
            {renderFormField('author', 'Author', 'text', null, 'Project author or team name')}
          </div>
        )}
      </div>

      {/* Framework Configuration */}
      <div className="space-y-3">
        {renderSectionHeader('framework', 'Framework Configuration', 'React and build tool settings')}
        {expandedSections.framework && (
          <div className="p-4 space-y-4 bg-surface border border-border rounded-lg">
            {renderFormField('reactVersion', 'React Version', 'select', [
              { value: '18.2.0', label: 'React 18.2.0 (Recommended)' },
              { value: '17.0.2', label: 'React 17.0.2' },
              { value: '16.14.0', label: 'React 16.14.0' }
            ], 'Choose your React version')}
            {renderFormField('buildTool', 'Build Tool', 'select', [
              { value: 'vite', label: 'Vite (Recommended)' },
              { value: 'webpack', label: 'Webpack' },
              { value: 'parcel', label: 'Parcel' }
            ], 'Select your preferred build tool')}
            {renderFormField('typescript', 'TypeScript Support', 'toggle', null, 'Enable TypeScript in your project')}
            {renderFormField('eslint', 'ESLint Configuration', 'toggle', null, 'Include ESLint for code quality')}
          </div>
        )}
      </div>

      {/* Styling Configuration */}
      <div className="space-y-3">
        {renderSectionHeader('styling', 'Styling Configuration', 'CSS framework and styling options')}
        {expandedSections.styling && (
          <div className="p-4 space-y-4 bg-surface border border-border rounded-lg">
            {renderFormField('cssFramework', 'CSS Framework', 'select', [
              { value: 'tailwind', label: 'Tailwind CSS (Recommended)' },
              { value: 'bootstrap', label: 'Bootstrap' },
              { value: 'material-ui', label: 'Material-UI' },
              { value: 'styled-components', label: 'Styled Components' },
              { value: 'css-modules', label: 'CSS Modules' }
            ], 'Choose your CSS framework')}
            {renderFormField('darkMode', 'Dark Mode Support', 'toggle', null, 'Enable dark/light theme toggle')}
            {renderFormField('responsive', 'Responsive Design', 'toggle', null, 'Include responsive breakpoints')}
            {renderFormField('animations', 'Animation Library', 'select', [
              { value: 'framer-motion', label: 'Framer Motion' },
              { value: 'react-spring', label: 'React Spring' },
              { value: 'css-animations', label: 'CSS Animations' },
              { value: 'none', label: 'No Animations' }
            ], 'Select animation library')}
          </div>
        )}
      </div>

      {/* Features Configuration */}
      <div className="space-y-3">
        {renderSectionHeader('features', 'Features Configuration', 'Additional features and integrations')}
        {expandedSections.features && (
          <div className="p-4 space-y-4 bg-surface border border-border rounded-lg">
            {renderFormField('routing', 'Routing', 'toggle', null, 'Include React Router for navigation')}
            {renderFormField('stateManagement', 'State Management', 'select', [
              { value: 'context', label: 'React Context' },
              { value: 'redux', label: 'Redux Toolkit' },
              { value: 'zustand', label: 'Zustand' },
              { value: 'none', label: 'No State Management' }
            ], 'Choose state management solution')}
            {renderFormField('formHandling', 'Form Handling', 'select', [
              { value: 'react-hook-form', label: 'React Hook Form' },
              { value: 'formik', label: 'Formik' },
              { value: 'native', label: 'Native React Forms' }
            ], 'Select form handling library')}
            {renderFormField('testing', 'Testing Framework', 'toggle', null, 'Include Jest and React Testing Library')}
          </div>
        )}
      </div>

      {/* Advanced Configuration */}
      <div className="space-y-3">
        {renderSectionHeader('advanced', 'Advanced Configuration', 'Performance and optimization settings')}
        {expandedSections.advanced && (
          <div className="p-4 space-y-4 bg-surface border border-border rounded-lg">
            {renderFormField('bundleSize', 'Bundle Size Optimization', 'range', { min: 1, max: 10 }, 'Optimization level (1=basic, 10=aggressive)')}
            {renderFormField('codesplitting', 'Code Splitting', 'toggle', null, 'Enable automatic code splitting')}
            {renderFormField('pwa', 'Progressive Web App', 'toggle', null, 'Add PWA capabilities')}
            {renderFormField('i18n', 'Internationalization', 'toggle', null, 'Include i18n support')}
            {renderFormField('analytics', 'Analytics Integration', 'select', [
              { value: 'google', label: 'Google Analytics' },
              { value: 'mixpanel', label: 'Mixpanel' },
              { value: 'amplitude', label: 'Amplitude' },
              { value: 'none', label: 'No Analytics' }
            ], 'Choose analytics provider')}
          </div>
        )}
      </div>

      {/* Validation Button */}
      <div className="pt-4 border-t border-border">
        <Button
          variant="secondary"
          onClick={onValidate}
          loading={isValidating}
          iconName="CheckCircle"
          iconPosition="left"
          className="w-full"
        >
          Validate Configuration
        </Button>
      </div>
    </div>
  );
};

export default ConfigurationForm;