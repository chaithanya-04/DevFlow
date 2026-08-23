import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import DashboardLayout from '../components/layout/DashboardLayout';
import {
  User,
  Palette,
  LogOut,
  Sun,
  Moon,
  Monitor,
  Lock,
  Check,
  AlertCircle,
  Loader2,
  Save,
  Eye,
  EyeOff,
} from 'lucide-react';

const Settings = () => {
  const { user, logout, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  // Profile Form State
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Sync state if user loads later
  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
    }
  }, [user]);

  // Handle Profile Update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileSuccess('');
    setProfileError('');

    try {
      const res = await api.put('/users/profile', { name: profileName });
      updateUser(res.data.data);
      setProfileSuccess('Profile updated successfully!');
      setTimeout(() => setProfileSuccess(''), 3500);
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle Theme Change
  const handleThemeChange = async (newTheme) => {
    setTheme(newTheme);
    try {
      const res = await api.put('/users/preferences', { theme: newTheme });
      updateUser(res.data.data);
    } catch (err) {
      console.error('Failed to sync theme with backend:', err);
    }
  };

  // Handle Password Change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordSuccess('');
    setPasswordError('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      setPasswordLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      setPasswordLoading(false);
      return;
    }

    try {
      const res = await api.put('/users/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordSuccess(res.data.message || 'Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordSuccess(''), 3500);
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const themeOptions = [
    { value: 'light', label: 'Light', icon: <Sun size={20} />, description: 'Always use light theme' },
    { value: 'dark', label: 'Dark', icon: <Moon size={20} />, description: 'Always use dark theme' },
    { value: 'system', label: 'System', icon: <Monitor size={20} />, description: 'Follow OS preference' },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account profile, appearance, and security.</p>
      </div>

      <div className="space-y-6 max-w-3xl pb-12">
        {/* Profile Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <User size={20} className="text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Profile Information</h3>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-md">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">{user?.name}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold
                ${
                  user?.role === 'Admin'
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    : user?.role === 'Project Manager'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                }`}
              >
                {user?.role}
              </span>
            </div>
          </div>

          {profileSuccess && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-lg text-sm flex items-center gap-2">
              <Check size={16} />
              {profileSuccess}
            </div>
          )}

          {profileError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {profileError}
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 cursor-not-allowed text-sm"
              />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Email cannot be changed directly.</p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={profileLoading || profileName === user?.name}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors shadow-sm"
              >
                {profileLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Profile
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Appearance Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Palette size={20} className="text-purple-600 dark:text-purple-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Appearance & Theme</h3>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Customize the look and feel of DevFlow. Theme settings are saved to your account.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleThemeChange(option.value)}
                className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all text-left relative
                  ${
                    theme === option.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400 ring-2 ring-blue-200 dark:ring-blue-800'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
              >
                {theme === option.value && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                )}
                <div
                  className={`p-3 rounded-lg ${
                    theme === option.value
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400'
                      : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                  }`}
                >
                  {option.icon}
                </div>
                <div className="text-center">
                  <p
                    className={`text-sm font-semibold ${
                      theme === option.value
                        ? 'text-blue-700 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {option.label}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{option.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Security & Password Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Lock size={20} className="text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Security & Password</h3>
          </div>

          {passwordSuccess && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-lg text-sm flex items-center gap-2">
              <Check size={16} />
              {passwordSuccess}
            </div>
          )}

          {passwordError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {passwordError}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  required
                  className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
                  aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'}
                >
                  {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                    minLength={6}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors"
                    placeholder="Min 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
                    aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                    minLength={6}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors"
                    placeholder="Re-enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={passwordLoading}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors shadow-sm"
              >
                {passwordLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Updating Password...
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    Update Password
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Account / Session Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <LogOut size={20} className="text-red-600 dark:text-red-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Sign Out</h3>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
            Signing out will clear your session from this device. You will need to log in again to access DevFlow.
          </p>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 font-medium rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shadow-sm"
          >
            <LogOut size={16} />
            Logout from DevFlow
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
