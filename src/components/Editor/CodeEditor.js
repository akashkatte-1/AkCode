// File: CodeEditor.js

import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { RotateCcw, Play, Upload } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { programmingLanguages, codeTemplates } from '../../data/mockData';

const CodeEditor = ({
  onRunCode,
  onSubmitCode,
  isRunning = false,
  isSubmitting = false,
  initialCode = '',
  language = 'javascript',
  onLanguageChange,
  problem = null,
  submissionResult = null
}) => {
  const [code, setCode] = useState(initialCode);
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [fontSize, setFontSize] = useState(14);
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
    }
    if (trimmedCode.length < 10) {
      errors.push('Code is too short');
    }
    if (lang === 'javascript') {
      if (!trimmedCode.includes('function') && !trimmedCode.includes('=>')) {
        errors.push('JavaScript code should contain a function declaration');
      }
    }

    setCodeErrors(errors);
    setIsCodeValid(errors.length === 0);
  };

  const handleReset = () => {
    setCode(codeTemplates[selectedLanguage] || '');
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

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    setCode(codeTemplates[lang] || '');
    if (onLanguageChange) onLanguageChange(lang);
  };

  const renderTestResults = () => {
    if (!submissionResult || !submissionResult.details) return null;
    return (
      <div className="p-4 border-t border-gray-300 dark:border-gray-700">
        <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2">Test Case Results:</h4>
        <ul className="space-y-2">
          {submissionResult.details.map((test, index) => (
            <li
              key={index}
              className={`p-2 rounded-lg border ${
                test.passed
                  ? 'border-green-300 bg-green-50 dark:bg-green-900/20'
                  : 'border-red-300 bg-red-50 dark:bg-red-900/20'
              }`}
            >
              <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                Test Case {index + 1} {test.passed ? '✅' : '❌'}
              </div>
              {!test.passed && (
                <div className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                  <div>
                    <strong>Input:</strong>{' '}
                    <pre className="inline whitespace-pre-wrap">{test.input}</pre>
                  </div>
                  <div>
                    <strong>Expected:</strong>{' '}
                    <pre className="inline whitespace-pre-wrap">{test.expectedOutput}</pre>
                  </div>
                  <div>
                    <strong>Got:</strong>{' '}
                    <pre className="inline whitespace-pre-wrap">{test.actualOutput}</pre>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="flex items-center space-x-4">
          <label htmlFor="language" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Language:
          </label>
          <select
            id="language"
            value={selectedLanguage}
            onChange={handleLanguageChange}
            className="text-sm px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {Object.keys(programmingLanguages).map((langKey) => (
              <option key={langKey} value={langKey}>
                {programmingLanguages[langKey]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">Font:</label>
          <input
            type="range"
            min="12"
            max="20"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-24"
          />
        </div>
      </div>

      <div className="p-4">
        <Editor
          height="300px"
          defaultLanguage={selectedLanguage}
          language={selectedLanguage}
          value={code}
          theme={isDark ? 'vs-dark' : 'light'}
          onChange={(value) => setCode(value)}
          options={{ fontSize }}
        />
        {codeErrors.length > 0 && (
          <ul className="mt-2 text-sm text-red-500">
            {codeErrors.map((err, idx) => (
              <li key={idx}>• {err}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex justify-between p-4">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-black"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
        <div className="flex gap-4">
          <button
            onClick={handleRun}
            disabled={!code.trim() || isRunning}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            <Play className="w-4 h-4 inline" /> {isRunning ? 'Running...' : 'Run'}
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isCodeValid || isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            <Upload className="w-4 h-4 inline" /> {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>

      {renderTestResults()}
    </div>
  );
};

export default CodeEditor;
