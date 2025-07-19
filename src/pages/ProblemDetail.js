
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  Clock, 
  Users, 
  CheckCircle, 
  Tag, 
  Trophy, 
  Target,
  BarChart3,
  AlertCircle,
  XCircle,
  Play
} from 'lucide-react';
import CodeEditor from '../components/Editor/CodeEditor';
import { problemsAPI, submissionsAPI } from '../services/api';
import { codeTemplates } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';


const ProblemDetail = () => {
  const { slug } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [testInput, setTestInput] = useState('');
  const [testOutput, setTestOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [userSubmissions, setUserSubmissions] = useState([]);
  const [initialCode, setInitialCode] = useState('');
  const [language, setLanguage] = useState('javascript');

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        const response = await problemsAPI.getBySlug(slug);
        const problemData = response.data.problem;
        setProblem(problemData);
        
        // Set default test input from first sample test case
        if (problemData.testCases && problemData.testCases.length > 0) {
          const sampleTestCase = problemData.testCases.find(tc => tc.is_sample) || problemData.testCases[0];
          setTestInput(sampleTestCase.input);
        }

        // Set initial code template based on language
        if (codeTemplates[language]) {
          setInitialCode(codeTemplates[language]);
        }

        // Fetch user submissions for this problem if authenticated
        if (isAuthenticated) {
          fetchUserSubmissions(problemData.id);
        }
      } catch (error) {
        console.error('Error fetching problem:', error);
        toast.error('Failed to fetch problem');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProblem();
    }
  }, [slug, isAuthenticated, language]);
  const fetchUserSubmissions = async (problemId) => {
    try {
      const response = await submissionsAPI.getUserSubmissions({ problemId, limit: 10 });
      setUserSubmissions(response.data.submissions);
    } catch (error) {
      console.error('Error fetching user submissions:', error);
    }
  };

  const handleRunCode = async (code, language) => {
    if (!isAuthenticated) {
      toast.error('Please log in to run code');
      return;
    }
    if (!code.trim()) {
      toast.error('Please write some code before running');
      return;
    }
  
    setIsRunning(true);
    setTestOutput('');
  
    try {
      const { data } = await submissionsAPI.run({
        code,
        language,
        problemId: problem.id,
        onlySamples: true
      });
  
      const output = data.result.output?.trim() || '[No Output]';
      setTestOutput(output);
      toast.success('Code executed successfully!');
    } catch (error) {
      const msg = error.response?.data?.error || 'Error executing code';
      toast.error(msg);
      setTestOutput(`Error: ${msg}`);
    } finally {
      setIsRunning(false);
    }
  };
  

  const handleSubmitCode = async (code, language) => {
    if (!isAuthenticated) {
      toast.error('Please log in to submit code');
      return;
    }

    if (!code.trim()) {
      toast.error('Please write some code before submitting');
      return;
    }

    setIsSubmitting(true);
    setSubmissionResult(null);
    
    try {
      const response = await submissionsAPI.submit({
        problemId: problem.id,
        code,
        language
      });
      
      const result = response.data.result;
      setSubmissionResult(result);
      
      if (result.status === 'Accepted') {
        toast.success('🎉 Congratulations! Your solution is correct!');
      } else {
        toast.error(`Submission failed: ${result.status}`);
      }

      // Refresh user submissions
      fetchUserSubmissions(problem.id);
    } catch (error) {
      const message = error.response?.data?.error || 'Error submitting code';
      toast.error(message);
      setSubmissionResult({
        status: 'Error',
        error: message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Wrong Answer':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'Time Limit Exceeded':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'Runtime Error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'Compilation Error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Wrong Answer':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Time Limit Exceeded':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'Runtime Error':
      case 'Compilation Error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading problem...</p>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Problem Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            The problem you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const difficultyColors = {
    Easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    Hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  };

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'submissions', label: `My Submissions (${userSubmissions.length})` },
    { id: 'solutions', label: 'Solutions' },
    { id: 'discuss', label: 'Discuss' }
  ];
  // Defensive check for tags to avoid runtime errors
  const tags = Array.isArray(problem.tags) ? problem.tags : [];
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Problem Description */}
          <div className="space-y-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {problem.title}
                  </h1>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${difficultyColors[problem.difficulty]}`}>
                      {problem.difficulty}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Problem #{problem.id}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    {problem.acceptance_rate}%
                  </span>
                </div>
              </div>
  
              <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{problem.total_submissions} submissions</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Trophy className="h-4 w-4" />
                  <span>{problem.accepted_submissions} accepted</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{new Date(problem.created_at).toLocaleDateString()}</span>
                </div>
              </div>
  
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
            >
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'description' && (
                  <div className="space-y-6">
                    <div className="prose dark:prose-invert max-w-none">
                      <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                        {problem.description}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          Input Format
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300">
                          {problem.input_format}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          Output Format
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300">
                          {problem.output_format}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          Constraints
                        </h3>
                        <pre className="text-sm bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-800 dark:text-gray-200">
                          {problem.constraints}
                        </pre>
                      </div>
                    </div>

                    {/* Sample Test Cases */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Sample Test Cases
                      </h3>
                      <div className="space-y-4">
                        {problem.testCases.filter(tc => tc.is_sample).map((testCase, index) => (
                          <div key={testCase.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                              Example {index + 1}
                            </h4>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Input:
                                </label>
                                <pre className="text-sm bg-white dark:bg-gray-800 p-2 rounded border text-gray-800 dark:text-gray-200">
                                  {testCase.input}
                                </pre>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Expected Output:
                                </label>
                                <pre className="text-sm bg-white dark:bg-gray-800 p-2 rounded border text-gray-800 dark:text-gray-200">
                                        {testCase.expected_output}
                                </pre>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'submissions' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      My Submissions
                    </h3>
                    {userSubmissions.length > 0 ? (
                      <div className="space-y-3">
                        {userSubmissions.map((submission) => (
                          <div key={submission.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex items-center space-x-3">
                              {getStatusIcon(submission.status)}
                              <div>
                                <div className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(submission.status)}`}>
                                  {submission.status}
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                  {submission.language} • {new Date(submission.submitted_at).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right text-sm">
                              <div className="text-gray-900 dark:text-white">
                                {submission.test_cases_passed}/{submission.total_test_cases} passed
                              </div>
                              <div className="text-gray-500 dark:text-gray-400">
                                {submission.runtime} • {submission.memory}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Play className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">
                          No submissions yet. Submit your first solution!
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'solutions' && (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Solutions will be available after you solve the problem
                    </p>
                  </div>
                )}

                {activeTab === 'discuss' && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Discussion forum coming soon
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Code Editor and Test Section */}
          <div className="space-y-6">
            {/* Code Editor */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <CodeEditor
  onRunCode={handleRunCode}
  onSubmitCode={handleSubmitCode}
  isRunning={isRunning}
  isSubmitting={isSubmitting}
  initialCode={initialCode}
  language={language}
  problem={problem}
  submissionResult={submissionResult} // <-- required for per-test-case result
/>

            </motion.div>

            {/* Test Input/Output */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Test Console
                </h3>
              </div>
              
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Input:
                  </label>
                  <textarea
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Enter test input..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Output:
                  </label>
                  <div className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 min-h-[100px]">
                    {isRunning ? (
                      <div className="flex items-center space-x-2">
                        <div className="spinner"></div>
                        <span>Running code...</span>
                      </div>
                    ) : (
                      <pre className="text-sm whitespace-pre-wrap">
                        {testOutput || 'Run your code to see the output'}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Submission Result */}
            {submissionResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Submission Result
                  </h3>
                </div>
                
                <div className="p-4">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(submissionResult.status)}`}>
                    {getStatusIcon(submissionResult.status)}
                    <span className="ml-1">{submissionResult.status}</span>
                  </div>
                  
                  {submissionResult.status === 'Accepted' ? (
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Runtime:</span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-white">
                          {submissionResult.runtime}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Memory:</span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-white">
                          {submissionResult.memory}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Test Cases:</span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-white">
                          {submissionResult.testCasesPassed}/{problem.testCases.length}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Failed:</span> {submissionResult.output}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        <span className="font-medium">Test Cases Passed:</span> {submissionResult.testCasesPassed}/{problem.testCases.length}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetail;