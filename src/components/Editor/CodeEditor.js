import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Upload, 
  RotateCcw, 
  Settings, 
  Maximize2, 
  Minimize2,
  Copy,
  Check,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { programmingLanguages, codeTemplates } from '../../data/mockData';

const CodeEditor = ({ 
  onRunCode, 
  onSubmitCode, 
  isRunning = false, 
  isSubmitting = false,
  initialCode = '',
  language = 'javascript',
  problem = null
}) => {
  const [code, setCode] = useState(initialCode);
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [showSettings, setShowSettings] = useState(false);
  const [copied, setCopied] = useState(false);
  const [codeErrors, setCodeErrors] = useState([]);
  const [isCodeValid, setIsCodeValid] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
    } else {
      setCode(codeTemplates[selectedLanguage] || '');
    }
  }, [selectedLanguage, initialCode]);

  useEffect(() => {
    validateCode(code, selectedLanguage);
  }, [code, selectedLanguage]);

  const validateCode = (codeText, lang) => {
    const errors = [];
    const trimmedCode = codeText.trim();
    
    if (!trimmedCode) {
      errors.push('Code cannot be empty');
      setIsCodeValid(false);
      setCodeErrors(errors);
      return;
    }

    if (trimmedCode.length < 10) {
      errors.push('Code is too short');
    }

    // Language-specific validation
    if (lang === 'javascript') {
      if (!trimmedCode.includes('function') && !trimmedCode.includes('=>') && !trimmedCode.includes('const') && !trimmedCode.includes('let')) {
        errors.push('JavaScript code should contain a function declaration');
      }
      if (!trimmedCode.includes('return') && !trimmedCode.includes('console.log')) {
        errors.push('JavaScript code should return a value or produce output');
      }
    } else if (lang === 'python') {
      if (!trimmedCode.includes('def ') && !trimmedCode.includes('print(') && !trimmedCode.includes('return')) {
        errors.push('Python code should contain a function definition or output statement');
      }
    } else if (lang === 'java') {
      if (!trimmedCode.includes('public') || !trimmedCode.includes('class')) {
        errors.push('Java code should contain a public class');
      }
    } else if (lang === 'cpp') {
      if (!trimmedCode.includes('#include') || !trimmedCode.includes('int main')) {
        errors.push('C++ code should include headers and main function');
      }
    }

    // Check for placeholder text
    if (trimmedCode.includes('Write your solution here') || 
        trimmedCode.includes('Write your code here') ||
        trimmedCode.includes('TODO') ||
        trimmedCode.includes('Example:') ||
        trimmedCode.includes('...')) {
      errors.push('Please replace placeholder text with actual code');
    }

    setCodeErrors(errors);
    setIsCodeValid(errors.length === 0 && trimmedCode.length >= 10);
  };

  const handleLanguageChange = (newLanguage) => {
    setSelectedLanguage(newLanguage);
    if (!initialCode) {
      setCode(codeTemplates[newLanguage] || '');
    }
  };

  const handleReset = () => {
    setCode(codeTemplates[selectedLanguage] || '');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleRun = () => {
    if (onRunCode && code.trim()) {
      onRunCode(code, selectedLanguage);
    }
  };

  const handleSubmit = () => {
    if (onSubmitCode && isCodeValid) {
      onSubmitCode(code, selectedLanguage);
    }
  };

  const editorOptions = {
    minimap: { enabled: false },
    fontSize: fontSize,
    lineNumbers: 'on',
    roundedSelection: false,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    wordWrap: 'on',
    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
    renderLineHighlight: 'gutter',
    selectOnLineNumbers: true,
    matchBrackets: 'always',
    theme: isDark ? 'vs-dark' : 'vs-light',
    bracketPairColorization: { enabled: true },
    autoIndent: 'full',
    formatOnPaste: true,
    formatOnType: true
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 ${
      isFullscreen ? 'fixed inset-0 z-50' : ''
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Code Editor
          </h3>
          
          {/* Language Selector */}
          <select
            value={selectedLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {programmingLanguages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>

          {/* Code Validation Status */}
          <div className="flex items-center space-x-2">
            {isCodeValid ? (
              <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                <CheckCircle className="h-4 w-4" />
                <span className="text-xs">Valid</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4" />
                <span className="text-xs">Issues</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Copy code"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Code Validation Errors */}
      {codeErrors.length > 0 && (
        <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-700 dark:text-red-300">
              <div className="font-medium mb-1">Code Issues:</div>
              <ul className="list-disc list-inside space-y-1">
                {codeErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
        >
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Font Size:
              </label>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm"
              >
                <option value={12}>12px</option>
                <option value={14}>14px</option>
                <option value={16}>16px</option>
                <option value={18}>18px</option>
                <option value={20}>20px</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {/* Editor */}
      <div className={`${isFullscreen ? 'h-full' : 'h-96'} border-b border-gray-200 dark:border-gray-700`}>
        <Editor
          language={selectedLanguage}
          value={code}
          onChange={(value) => setCode(value || '')}
          options={editorOptions}
          theme={isDark ? 'vs-dark' : 'vs-light'}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={handleReset}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRun}
            disabled={isRunning || !code.trim()}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Play className="h-4 w-4" />
            <span>{isRunning ? 'Running...' : 'Run'}</span>
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !isCodeValid}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            title={!isCodeValid ? 'Please fix code issues before submitting' : 'Submit your solution'}
          >
            <Upload className="h-4 w-4" />
            <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;