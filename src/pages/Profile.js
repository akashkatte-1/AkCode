import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Trophy, 
  Target, 
  Calendar, 
  Star, 
  Award, 
  TrendingUp,
  BookOpen,
  Clock,
  Medal,
  Edit
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { submissionsAPI } from '../services/api';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [userSubmissions, setUserSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);

  useEffect(() => {
    const fetchUserSubmissions = async () => {
      try {
        setLoadingSubmissions(true);
        const response = await submissionsAPI.getUserSubmissions();
        setUserSubmissions(response.data || []);
      } catch (error) {
        console.error('Error fetching user submissions:', error);
        setUserSubmissions([]);
      } finally {
        setLoadingSubmissions(false);
      }
    };

    if (user?.id) {
      fetchUserSubmissions();
    }
  }, [user?.id]);

  const submissions = Array.isArray(userSubmissions) ? userSubmissions : [];
  const acceptedSubmissions = submissions.filter(sub => sub.status === 'Accepted');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'submissions', label: 'Submissions', icon: BookOpen },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'activity', label: 'Activity', icon: TrendingUp }
  ];

  const stats = [
    { 
      label: 'Problems Solved', 
      value: user.solvedProblems, 
      icon: Target,
      color: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
    },
    { 
      label: 'Total Submissions', 
      value: user.totalSubmissions, 
      icon: BookOpen,
      color: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30'
    },
    { 
      label: 'Current Streak', 
      value: `${user.streak} days`, 
      icon: TrendingUp,
      color: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30'
    },
    { 
      label: 'Contest Rating', 
      value: user.ranking, 
      icon: Medal,
      color: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center space-x-6">
            <img
              src={user.avatar}
              alt={user.username}
              className="w-24 h-24 rounded-full border-4 border-blue-500"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {user.username}
                </h1>
                <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {user.email}
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-yellow-600 dark:text-yellow-400">
                  <Star className="h-5 w-5" />
                  <span className="font-medium">Level {user.level}</span>
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {user.xp} XP
                </div>
                <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {user.joinedAt}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Level {user.level} Progress
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {user.xp % 1000}/1000 XP
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(user.xp % 1000) / 10}%` }}
              ></div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
        >
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    {acceptedSubmissions.slice(0, 5).map((submission) => (
                      <div key={submission.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Solved Problem #{submission.problemId}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {submission.submittedAt}
                          </p>
                        </div>
                        <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                          {submission.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Badges */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Badges
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {user.badges.map((badge, index) => (
                      <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {badge}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'submissions' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Submission History
                </h3>
                {loadingSubmissions ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Loading submissions...</p>
                  </div>
                ) : userSubmissions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">No submissions yet</p>
                  </div>
                ) : (
                <div className="space-y-3">
                  {userSubmissions.map((submission) => (
                    <div key={submission.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          submission.status === 'Accepted' ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            Problem #{submission.problemId}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {submission.language} • {submission.submittedAt}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${
                          submission.status === 'Accepted' 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {submission.status}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {submission.runtime} • {submission.memory}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                )}
              </div>
            )}

            {activeTab === 'achievements' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Achievements
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Trophy className="h-8 w-8 text-yellow-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Problem Solver
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Solved 25+ problems
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Target className="h-8 w-8 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Speed Demon
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Solved problem in under 10 minutes
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <TrendingUp className="h-8 w-8 text-green-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Streak Master
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Maintained 7+ day streak
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Medal className="h-8 w-8 text-purple-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Contest Participant
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Participated in 3+ contests
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Activity Timeline
                </h3>
                <div className="space-y-4">
                  {Array.from({ length: 10 }, (_, i) => (
                    <div key={i} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Activity {i + 1}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;