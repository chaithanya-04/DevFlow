import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const Unauthorized = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center">
      <ShieldAlert size={64} className="mx-auto text-red-500 mb-4" />
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Access Denied</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">You don't have permission to access this page.</p>
      <Link to="/dashboard" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        Go to Dashboard
      </Link>
    </div>
  </div>
);

export default Unauthorized;