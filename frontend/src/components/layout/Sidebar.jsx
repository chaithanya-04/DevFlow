import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, FolderKanban, ListTodo, Users, Shield, Settings, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard', roles: ['Admin', 'Project Manager', 'Developer'] },
    { label: 'Projects', icon: <FolderKanban size={20} />, path: '/projects', roles: ['Admin', 'Project Manager', 'Developer'] },
    { label: 'Tasks', icon: <ListTodo size={20} />, path: '/tasks', roles: ['Admin', 'Project Manager', 'Developer'] },
    { label: 'Team', icon: <Users size={20} />, path: '/team', roles: ['Admin', 'Project Manager'] },
    { label: 'Admin Panel', icon: <Shield size={20} />, path: '/admin', roles: ['Admin'] },
    { label: 'Settings', icon: <Settings size={20} />, path: '/settings', roles: ['Admin', 'Project Manager', 'Developer'] },
  ];

  const visible = navItems.filter(item => item.roles.includes(user?.role));

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`bg-slate-900 text-white h-screen flex flex-col transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700">
        {!collapsed && <Link to="/dashboard" className="text-xl font-bold text-blue-400">DevFlow</Link>}
        <button onClick={() => setCollapsed(!collapsed)} className="p-1 rounded-md hover:bg-slate-700">
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 py-4 space-y-1">
        {visible.map(item => (
          <Link key={item.path} to={item.path}
            className={`flex items-center px-4 py-3 mx-2 rounded-lg transition-all ${isActive(item.path) ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
            <span className="flex-shrink-0">{item.icon}</span>
            {!collapsed && <span className="ml-3 text-sm font-medium">{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="border-t border-slate-700 p-4">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-sm font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.role}</p>
            </div>
          )}
        </div>
        <button onClick={logout} className={`mt-3 flex items-center text-red-400 hover:text-red-300 ${collapsed ? 'justify-center w-full' : 'px-2'}`}>
          <LogOut size={18} />
          {!collapsed && <span className="ml-2 text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;