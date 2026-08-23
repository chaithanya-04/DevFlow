import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Tasks from './pages/Tasks';
import Settings from './pages/Settings';
import Unauthorized from './pages/Unauthorized';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/projects" element={
            <ProtectedRoute><Projects /></ProtectedRoute>
          } />
          <Route path="/projects/:id" element={
            <ProtectedRoute><ProjectDetails /></ProtectedRoute>
          } />
          <Route path="/tasks" element={
            <ProtectedRoute><Tasks /></ProtectedRoute>
            } />
          <Route path="/settings" element={
            <ProtectedRoute><Settings /></ProtectedRoute>
          } />
          <Route path="/" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;