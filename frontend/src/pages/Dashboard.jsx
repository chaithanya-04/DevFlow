import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { FolderOpen, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

const StatCard = ({ title, value, icon, color }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    red: 'bg-red-50 text-red-600 border-red-200'
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg border ${colors[color]}`}>{icon}</div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-500 mt-1">
          {user?.role === 'Admin' ? 'Manage users and projects.' :
           user?.role === 'Project Manager' ? 'Create and assign tasks.' :
           'View and update your tasks.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Projects" value="0" icon={<FolderOpen size={20} />} color="blue" />
        <StatCard title="Completed Tasks" value="0" icon={<CheckCircle2 size={20} />} color="green" />
        <StatCard title="Pending Tasks" value="0" icon={<Clock size={20} />} color="yellow" />
        <StatCard title="High Priority" value="0" icon={<AlertTriangle size={20} />} color="red" />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;