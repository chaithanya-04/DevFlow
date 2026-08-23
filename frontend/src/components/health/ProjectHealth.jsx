import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Activity, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

const ProjectHealth = ({ projectId }) => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (projectId) {
      fetchHealth();
    }
  }, [projectId]);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/health/${projectId}`);
      setHealth(res.data.data);
    } catch (error) {
      console.error('Health score failed', error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message
  });
    } finally {
      setLoading(false);
    }
  };

  if (!projectId) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-center text-gray-500 dark:text-gray-400">
        Select a project to view health score.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!health || health.score === null) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Project Health</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{health?.summary || 'No data available.'}</p>
      </div>
    );
  }

  // Determine color based on score
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200';
    return 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200';
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return <CheckCircle size={24} className="text-green-600" />;
    if (score >= 50) return <TrendingUp size={24} className="text-yellow-600" />;
    return <AlertCircle size={24} className="text-red-600" />;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Activity size={20} className="text-purple-600" />
          AI Health Score
        </h3>
        <button
          onClick={fetchHealth}
          className="text-xs text-blue-600 hover:underline"
        >
          Refresh
        </button>
      </div>

      {/* Score Circle */}
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center text-2xl font-bold ${getScoreColor(health.score)}`}>
          {health.score}
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">out of 100</p>
          <div className="flex items-center gap-2 mt-1">
            {getScoreIcon(health.score)}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {health.score >= 80 ? 'Healthy' : health.score >= 50 ? 'At Risk' : 'Critical'}
            </span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 leading-relaxed">
        {health.summary}
      </p>

      {/* Stats Breakdown */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
          <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{health.stats.completedTasks}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
          <p className="text-xs text-gray-500 dark:text-gray-400">Pending</p>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{health.stats.pendingTasks}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
          <p className="text-xs text-gray-500 dark:text-gray-400">Overdue</p>
          <p className="text-lg font-bold text-red-600">{health.stats.overdueTasks}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
          <p className="text-xs text-gray-500 dark:text-gray-400">Task Completion Rate</p>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{health.stats.velocity} <span className="text-xs font-normal text-gray-500 dark:text-gray-400">/day</span></p>
        </div>
      </div>

      {/* Warnings */}
      {health.warnings.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Warnings</h4>
          {health.warnings.map((warning, idx) => (
            <div key={idx} className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg">
              <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-400">{warning}</p>
            </div>
          ))}
        </div>
      )}

      {health.warnings.length === 0 && health.score >= 80 && (
        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 rounded-lg">
          <CheckCircle size={16} className="text-green-500" />
          <p className="text-sm text-green-700 dark:text-green-400">All metrics look good. Project is on track.</p>
        </div>
      )}
    </div>
  );
};

export default ProjectHealth;