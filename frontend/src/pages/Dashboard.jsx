import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProjectHealth from '../components/health/ProjectHealth';
import api from '../api/axios';
import DashboardLayout from '../components/layout/DashboardLayout';
import { FolderOpen, CheckCircle2, Clock, AlertTriangle, TrendingUp, Activity } from 'lucide-react';

const StatCard = ({ title, value, icon, color, subtitle }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200'
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg border ${colors[color]}`}>{icon}</div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
    fetchProjects();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/dashboard/stats');
      setStats(res.data.data);
    } catch (err) {
      console.error('Failed to load dashboard stats', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
  try {
    const res = await api.get('/projects');
    setProjects(res.data.data);
    if (res.data.data.length > 0) {
      setSelectedProject(res.data.data[0]._id);
    }
  } catch (err) {
    console.error('Failed to load projects', err);
  }
};
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-500 mt-1">
          {user?.role === 'Admin' ? 'System overview and analytics.' :
           user?.role === 'Project Manager' ? 'Track project progress and team velocity.' :
           'Your tasks and project status at a glance.'}
        </p>
      </div>

      {stats && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Total Projects"
              value={stats.totalProjects}
              icon={<FolderOpen size={20} />}
              color="blue"
              subtitle="All projects"
            />
            <StatCard
              title="Total Tasks"
              value={stats.totalTasks}
              icon={<Activity size={20} />}
              color="purple"
              subtitle="Across all projects"
            />
            <StatCard
              title="Completed Tasks"
              value={stats.completedTasks}
              icon={<CheckCircle2 size={20} />}
              color="green"
              subtitle={`${stats.completionPercentage}% completion rate`}
            />
            <StatCard
              title="Pending Tasks"
              value={stats.pendingTasks}
              icon={<Clock size={20} />}
              color="yellow"
              subtitle="Awaiting action"
            />
            <StatCard
              title="High Priority"
              value={stats.highPriorityTasks}
              icon={<AlertTriangle size={20} />}
              color="red"
              subtitle="Remaining high-priority"
            />
            <StatCard
              title="Overdue Tasks"
              value={stats.overdueTasks}
              icon={<TrendingUp size={20} />}
              color="red"
              subtitle="Past deadline"
            />
            <StatCard
              title="Completion Rate"
              value={`${stats.completionPercentage}%`}
              icon={<CheckCircle2 size={20} />}
              color="green"
              subtitle="Overall progress"
            />
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">Overall Completion</h3>
              <span className="text-sm font-medium text-gray-600">{stats.completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${stats.completionPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* AI Health Score Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                  onClick={() => navigate('/projects')}
                  className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-left">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <FolderOpen size={18} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Manage Projects</p>
                  <p className="text-xs text-gray-500">View and edit projects</p>
                </div>
                </button>
                <button
                onClick={() => navigate('/tasks')}
                className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
                >
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                  <Activity size={18} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Open Kanban</p>
                  <p className="text-xs text-gray-500">Manage tasks and workflow</p>
                </div>
                </button>
              </div>
            </div>
          </div>
          <div>
            {projects.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Project for Health Analysis</label>
                <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                  {projects.map((p) => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>
            )}
            <ProjectHealth projectId={selectedProject} />
          </div>
        </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;