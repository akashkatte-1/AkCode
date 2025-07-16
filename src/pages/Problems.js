import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import ProblemCard from '../components/Problems/ProblemCard';
import ProblemFilters from '../components/Problems/ProblemFilters';
import { problemsAPI } from '../services/api';
import { toast } from 'react-hot-toast';

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficulty, setDifficulty] = useState('All');
  const [tags, setTags] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [availableTags, setAvailableTags] = useState([]);
  const problemsPerPage = 12;

  // Fetch problems from API
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        const response = await problemsAPI.getAll({
          page: currentPage,
          limit: problemsPerPage,
          difficulty: difficulty !== 'All' ? difficulty : undefined,
          tags: tags.length > 0 ? tags : undefined,
          search: searchTerm || undefined,
          sortBy
        });
        setProblems(response.data.problems);
      } catch (error) {
        toast.error('Failed to fetch problems');
        console.error('Error fetching problems:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [currentPage, difficulty, tags, searchTerm, sortBy]);

  // Fetch available tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await problemsAPI.getTags();
        setAvailableTags(response.data.tags);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, []);

  // Filter and sort problems locally for better UX
  const filteredProblems = useMemo(() => {
    let filtered = problems.filter(problem => {
      const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           problem.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty = difficulty === 'All' || problem.difficulty === difficulty;
      const matchesTags = tags.length === 0 || tags.some(tag => problem.tags.includes(tag));
      
      return matchesSearch && matchesDifficulty && matchesTags;
    });

    return filtered;
  }, [problems, searchTerm, difficulty, tags]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading problems...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Coding Problems
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Challenge yourself with {problems.length} coding problems
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <ProblemFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                difficulty={difficulty}
                setDifficulty={setDifficulty}
                tags={tags}
                setTags={setTags}
                availableTags={availableTags}
              />
            </div>
          </div>

          {/* Problems Grid */}
          <div className="lg:col-span-3">
            {/* Sort Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between mb-6"
            >
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredProblems.length} problems
              </div>
              
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sort by:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="acceptance">Acceptance Rate</option>
                  <option value="difficulty">Difficulty</option>
                </select>
              </div>
            </motion.div>

            {/* Problems Grid */}
            {filteredProblems.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredProblems.map((problem, index) => (
                  <ProblemCard key={problem.id} problem={problem} index={index} />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="text-gray-500 dark:text-gray-400">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-lg font-medium mb-2">No problems found</h3>
                  <p className="text-sm">Try adjusting your search criteria</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Problems;