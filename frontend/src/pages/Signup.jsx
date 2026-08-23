import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Developer' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signup(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">Create Account</h2>
        {error && <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 rounded-md text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Min 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
            <select name="role" value={formData.role} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500">
              <option value="Developer">Developer</option>
              <option value="Project Manager">Project Manager</option>
            </select>
          </div>
          <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">
            Create Account
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;