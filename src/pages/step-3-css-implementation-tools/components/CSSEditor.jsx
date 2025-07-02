import React, { useState, useEffect, useRef } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const CSSEditor = ({ cssCode, onCSSChange, selectedFramework, onValidationChange }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [editorContent, setEditorContent] = useState(cssCode || '');
  const [lineNumbers, setLineNumbers] = useState([]);
  const [errors, setErrors] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [isFormatting, setIsFormatting] = useState(false);
  const textareaRef = useRef(null);
  const suggestionsRef = useRef(null);

  const cssSnippets = [
    {
      name: "Flexbox Container",
      code: `.flex-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}`
    },
    {
      name: "Grid Layout",
      code: `.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}`
    },
    {
      name: "Button Styles",
      code: `.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  background: #3b82f6;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
}`
    },
    {
      name: "Card Component",
      code: `.card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: box-shadow 0.2s ease;
}

.card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}`
    },
    {
      name: "Responsive Typography",
      code: `.responsive-text {
  font-size: clamp(1rem, 2.5vw, 2rem);
  line-height: 1.6;
  color: #1f2937;
}

@media (max-width: 768px) {
  .responsive-text {
    font-size: 0.875rem;
  }
}`
    }
  ];

  const cssProperties = [
    'display', 'position', 'top', 'right', 'bottom', 'left', 'width', 'height',
    'margin', 'padding', 'border', 'background', 'color', 'font-size', 'font-weight',
    'text-align', 'justify-content', 'align-items', 'flex-direction', 'grid-template-columns',
    'border-radius', 'box-shadow', 'transition', 'transform', 'opacity', 'z-index'
  ];

  useEffect(() => {
    const savedLanguage = localStorage.getItem('stepBuilderPro_language');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    setEditorContent(cssCode || '');
  }, [cssCode]);

  useEffect(() => {
    updateLineNumbers();
    validateCSS();
  }, [editorContent]);

  const updateLineNumbers = () => {
    const lines = editorContent.split('\n');
    setLineNumbers(lines.map((_, index) => index + 1));
  };

  const validateCSS = () => {
    const lines = editorContent.split('\n');
    const newErrors = [];
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('/*') && !trimmedLine.endsWith('*/')) {
        // Basic CSS validation
        if (trimmedLine.includes(':') && !trimmedLine.includes('{') && !trimmedLine.includes('}')) {
          if (!trimmedLine.endsWith(';') && !trimmedLine.endsWith(',')) {
            newErrors.push({
              line: index + 1,
              message: 'Missing semicolon',
              type: 'warning'
            });
          }
        }
        
        // Check for unclosed braces
        const openBraces = (line.match(/{/g) || []).length;
        const closeBraces = (line.match(/}/g) || []).length;
        if (openBraces !== closeBraces && (openBraces > 0 || closeBraces > 0)) {
          // This is a simplified check - in real implementation, you'd track brace balance across the entire document
        }
      }
    });
    
    setErrors(newErrors);
    onValidationChange?.(newErrors.length === 0);
  };

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setEditorContent(newContent);
    onCSSChange?.(newContent);
    
    // Update cursor position
    const textarea = e.target;
    const lines = newContent.substring(0, textarea.selectionStart).split('\n');
    setCursorPosition({
      line: lines.length,
      column: lines[lines.length - 1].length + 1
    });
    
    // Show suggestions if typing
    const currentWord = getCurrentWord(newContent, textarea.selectionStart);
    if (currentWord.length > 1) {
      const matchingSuggestions = cssProperties.filter(prop => 
        prop.toLowerCase().startsWith(currentWord.toLowerCase())
      );
      setSuggestions(matchingSuggestions.slice(0, 5));
      setShowSuggestions(matchingSuggestions.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const getCurrentWord = (text, position) => {
    const beforeCursor = text.substring(0, position);
    const words = beforeCursor.split(/[\s\n\r\t{}();:]/);
    return words[words.length - 1] || '';
  };

  const insertSnippet = (snippet) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent = editorContent.substring(0, start) + snippet.code + editorContent.substring(end);
    
    setEditorContent(newContent);
    onCSSChange?.(newContent);
    
    // Focus back to textarea
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + snippet.code.length, start + snippet.code.length);
    }, 0);
  };

  const formatCSS = async () => {
    setIsFormatting(true);
    
    try {
      // Simple CSS formatting - in production, you'd use a proper CSS formatter
      const formatted = editorContent
        .replace(/\s*{\s*/g, ' {\n  ')
        .replace(/;\s*/g, ';\n  ')
        .replace(/\s*}\s*/g, '\n}\n\n')
        .replace(/,\s*/g, ',\n')
        .trim();
      
      setEditorContent(formatted);
      onCSSChange?.(formatted);
    } catch (error) {
      console.error('CSS formatting failed:', error);
    } finally {
      setIsFormatting(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(editorContent);
      // Could show success toast
    } catch (error) {
      console.error('Failed to copy CSS:', error);
    }
  };

  const handleKeyDown = (e) => {
    // Handle tab indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      const newContent = editorContent.substring(0, start) + '  ' + editorContent.substring(end);
      setEditorContent(newContent);
      onCSSChange?.(newContent);
      
      setTimeout(() => {
        textarea.setSelectionRange(start + 2, start + 2);
      }, 0);
    }
    
    // Handle suggestion selection
    if (showSuggestions && (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter')) {
      // Simplified - in production, you'd handle suggestion navigation
    }
  };

  return (
    <div className="h-full flex flex-col bg-surface border border-border rounded-lg overflow-hidden">
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-surface-50">
        <div className="flex items-center space-x-2">
          <Icon name="Code" size={16} className="text-text-secondary" />
          <span className="text-sm font-medium text-text-primary">CSS Editor</span>
          <div className="text-xs text-text-muted">
            {selectedFramework && `(${selectedFramework})`}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={formatCSS}
            loading={isFormatting}
            iconName="AlignLeft"
            iconSize={14}
          >
            Format
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            iconName="Copy"
            iconSize={14}
          >
            Copy
          </Button>
        </div>
      </div>

      {/* CSS Snippets */}
      <div className="p-3 border-b border-border bg-surface-50">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="Zap" size={14} className="text-accent-500" />
          <span className="text-xs font-medium text-text-primary">Quick Snippets</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {cssSnippets.map((snippet, index) => (
            <button
              key={index}
              onClick={() => insertSnippet(snippet)}
              className="px-2 py-1 text-xs bg-accent-50 text-accent-700 rounded hover:bg-accent-100 transition-colors duration-200"
            >
              {snippet.name}
            </button>
          ))}
        </div>
      </div>

      {/* Editor Container */}
      <div className="flex-1 flex relative">
        {/* Line Numbers */}
        <div className="w-12 bg-surface-50 border-r border-border flex-shrink-0">
          <div className="p-2 text-xs text-text-muted font-mono leading-6">
            {lineNumbers.map(num => (
              <div key={num} className="text-right">
                {num}
              </div>
            ))}
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={editorContent}
            onChange={handleContentChange}
            onKeyDown={handleKeyDown}
            className="w-full h-full p-2 text-sm font-mono leading-6 bg-transparent border-none outline-none resize-none text-text-primary"
            placeholder="/* Write your CSS here */\n\n.example {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}"
            spellCheck={false}
          />
          
          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute z-10 bg-surface border border-border rounded-md shadow-elevation-2 max-h-32 overflow-y-auto"
              style={{ top: '2rem', left: '1rem' }}
            >
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="w-full px-3 py-1 text-left text-sm text-text-primary hover:bg-surface-50 first:rounded-t-md last:rounded-b-md"
                  onClick={() => {
                    // Insert suggestion logic
                    setShowSuggestions(false);
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between p-2 border-t border-border bg-surface-50 text-xs text-text-muted">
        <div className="flex items-center space-x-4">
          <span>Line {cursorPosition.line}, Column {cursorPosition.column}</span>
          <span>{editorContent.length} characters</span>
          <span>{editorContent.split('\n').length} lines</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {errors.length > 0 && (
            <div className="flex items-center space-x-1 text-warning-600">
              <Icon name="AlertTriangle" size={12} />
              <span>{errors.length} warning{errors.length !== 1 ? 's' : ''}</span>
            </div>
          )}
          <div className="flex items-center space-x-1 text-success-600">
            <Icon name="Check" size={12} />
            <span>CSS</span>
          </div>
        </div>
      </div>

      {/* Error Panel */}
      {errors.length > 0 && (
        <div className="border-t border-border bg-warning-50 p-2 max-h-24 overflow-y-auto">
          {errors.map((error, index) => (
            <div key={index} className="flex items-center space-x-2 text-xs text-warning-700 mb-1">
              <Icon name="AlertTriangle" size={12} />
              <span>Line {error.line}: {error.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CSSEditor;