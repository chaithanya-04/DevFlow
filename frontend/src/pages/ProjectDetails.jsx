import {useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import DashboardLayout from '../components/layout/DashboardLayout';
import { ArrowLeft, Calendar, User, Edit, Trash2, Save, X } from 'lucide-react';

const ProjectDetails = () =>{
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const isAdmin = user?.role === 'Admin';

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});

    useEffect(() => {
        fetchProject();
    }, [id]);

    const fetchProject = async () =>{
        try{
            const res = await api(`/projects/${id}`);
            setProject(res.data.data);
            setEditData(res.data.data);
        }catch(err) {
            alert('Project not found');
            navigate('/projects');
        }finally{
            setLoading(false);
        }
    };

    const handleUpdate = async (e) =>{
        e.preventDefault();
        try{
            const res = await api.put(`/projects/${id}`, {
                name: editData.name,
                description: editData.description,
                startdate: editData.startdate,
                deadline: editData.deadline,
                status: editData.status
            });
            setProject(res.data.data);
            setIsEditing(false);
        }catch(err){
            alert(err.response?.data?.message || 'Failed to update project');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Delete this project permanently?'))
            return;
        try {
            await api.delete(`/projects/${id}`);navigate('/projects');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete project');
        }
    };

    const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
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

    if (!project) return null;

    return (
    <DashboardLayout>
      <button
        onClick={() => navigate('/projects')}
        className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6"
      >
        <ArrowLeft size={18} /> Back to Projects
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
        {isEditing ? (
          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Name</label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 text-xl font-bold"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              +
              <textarea
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start date</label>
                <input
                  type="date"
                  value={editData.startdate ? editData.startdate.split('T')[0] : ''}
                  onChange={(e) => setEditData({ ...editData, startdate: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
             </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deadline</label>
                <input
                  type="date"
                  value={editData.deadline ? editData.deadline.split('T')[0] : ''}
                  onChange={(e) => setEditData({ ...editData, deadline: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select
                  value={editData.status}
                  onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Planning">Planning</option>
                  <option value="Active">Active</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <X size={16} /> Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Save size={16} /> Save Changes
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{project.name}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    startdate: {formatDate(project.startdate)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    Deadline: {formatDate(project.deadline)}
                  </span>
                  <span className="flex items-center gap-1">
                    <User size={14} />
                    Owner: {project.owner?.name}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                    ${project.status === 'Active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700' :
                      project.status === 'Completed' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700' :
                      project.status === 'On Hold' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700' :
                      'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                    {project.status}
                  </span>
                </div>
              </div>

              {isAdmin && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-4 py-2 border border-red-300 dark:border-red-900/30 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              )}
            </div>

            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Description</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                {project.description}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Team Members</h3>
              {project.teamMembers?.length > 0 ? (
                <div className="flex gap-3">
                  {project.teamMembers.map((member) => (
                    <div key={member._id} className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center text-sm font-bold">
                        {member.name?.charAt(0)}
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{member.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 dark:text-gray-500 text-sm">No team members assigned yet.</p>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProjectDetails;

