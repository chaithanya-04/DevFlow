import { useAuth } from '../../context/AuthContext';
import { Bell } from 'lucide-react';

const Navbar = () => {
  const { user } = useAuth();

  const roleColors = {
    'Admin': 'bg-red-100 text-red-700',
    'Project Manager': 'bg-blue-100 text-blue-700',
    'Developer': 'bg-green-100 text-green-700'
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
      <div>
        <h1 className="text-lg font-semibold text-gray-800">
          {user ? `Welcome back, ${user.name.split(' ')[0]}` : 'DevFlow'}
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-gray-100 text-gray-600">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${roleColors[user?.role]}`}>
          {user?.role}
        </span>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
};

export default Navbar;