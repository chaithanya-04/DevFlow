import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Plus, Calendar, User, Trash2, Edit } from 'lucide-react';
import { useActionState } from "react";

const Projects =() =>{
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModel, setShowModel] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();
    const isAdmin = user?.role === 'Admin';

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startdate:'',
        deadline: ''
  });
    useEffect(()=>{
        fetchProjects();
    }, [])

    const fetchProjects = async () =>{
        try{
            const res = await api.get('/projects');
            setProjects(res.data.data);
        }catch(err){
            console.error('Failed to fetch projects', err);
        } finally {
            setLoading(false);
        }
    };
    const handlechange = (e) => {
        setFormData({... formData, [e.target.name]: e.target.value});
    };

    const handlecreate = async(e) =>{
        e.preventDefault();
        try{
            await api.post('/projects', formData);
            setShowModel(false);
            setFormData({ name: '', description: '',startdate: '',deadline: '' });
            fetchProjects();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create project');
        }
    };

    const handleDelete = async(id) => {
        if(!window.confirm('Are you sure you want to delete this project?')) 
            return;
        try{
            await api.delete(`/projects/${id}`);
            fetchProjects();
        }catch(err){
            alert(err.response?.data?.message || 'Failed to delete project');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN',{
            day:'numeric',
            month:'short',
            year:'numeric'
        });
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Projects</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your development projects</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowModel(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            New Project
          </button>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">No projects yet.</p>
          {isAdmin && (
            <button
              onClick={() => setShowModel(true)}
              className="mt-4 text-blue-600 hover:underline"
            >
              Create your first project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/projects/${project._id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                  {project.name}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium
                  ${project.status === 'Active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700' :
                    project.status === 'Completed' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700' :
                    project.status === 'On Hold' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700' :
                    'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                  {project.status}
                </span>
              </div>

              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {project.description}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-400 dark:text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  {formatDate(project.startdate)}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  {formatDate(project.deadline)}
                </div>
                <div className="flex items-center gap-1">
                  <User size={14} />
                  {project.owner?.name || 'Unknown'}
                </div>
              </div>

              {isAdmin && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/projects/${project._id}`);
                    }}
                    className="flex-1 flex items-center justify-center gap-1 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                  >
                    <Edit size={14} /> View
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(project._id);
                    }}
                    className="flex-1 flex items-center justify-center gap-1 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {/* Create Project Modal */}
      {showModel && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Create New Project</h3>
            <form onSubmit={handlecreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handlechange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Asset Flow App"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handlechange}
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="What is this project about?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start date</label>
                <input
                  type="date"
                  name="startdate"
                  value={formData.startdate}
                  onChange={handlechange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handlechange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModel(false)}
                  className="flex-1 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Projects;


