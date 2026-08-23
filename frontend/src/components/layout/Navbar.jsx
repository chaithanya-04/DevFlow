import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();

  const roleColors = {
    'Admin': 'bg-red-100 dark:bg-red-900/30 text-red-700',
    'Project Manager': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700',
    'Developer': 'bg-green-100 dark:bg-green-900/30 text-green-700'
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 sticky top-0 z-30">
      <div>
        <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {user ? `Welcome back, ${user.name.split(' ')[0]}` : 'DevFlow'}
        </h1>
      </div>
      <div className="flex items-center gap-4">
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