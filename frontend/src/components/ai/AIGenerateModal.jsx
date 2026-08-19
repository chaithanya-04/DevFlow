import { useState } from 'react';
import api from '../../api/axios';
import { Sparkles, X, Loader2, CheckCircle } from 'lucide-react';

const AIGenerateModal = ({ projectId, projects, onTasksCreated, onClose }) => {
  const [selectedProject, setSelectedProject] = useState(projectId || '');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedTasks, setGeneratedTasks] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!selectedProject || !description.trim()) return;

    setLoading(true);
    setGeneratedTasks(null);

    try {
      const res = await api.post('/ai/generate-tasks', {
        projectId: selectedProject,
        description: description.trim()
      });
      setGeneratedTasks(res.data.data);
    } catch (err) {
      alert(err.response?.data?.message || 'AI generation failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDone = () => {
    onTasksCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="text-purple-600" size={24} />
            <h3 className="text-xl font-bold text-gray-900">AI Task Generation</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>

        {!generatedTasks ? (
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select a project</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={5}
                placeholder="e.g. Build a food delivery app with authentication, cart, payments, and real-time tracking."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                The AI will analyze this description and generate development tasks.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Generating tasks with AI...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate Tasks
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
              <CheckCircle size={20} />
              <span className="font-medium">{generatedTasks.length} tasks generated and saved!</span>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {generatedTasks.map((task, idx) => (
                <div key={idx} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-start justify-between">
                    <h4 className="font-semibold text-gray-900">{task.title}</h4>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium
                      ${task.priority === 'High' ? 'bg-red-100 text-red-700' :
                        task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'}`}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>Difficulty: <strong>{task.difficulty}</strong></span>
                    <span>Est: <strong>{task.estimatedTime}</strong></span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleDone}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Done! View on Kanban Board
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIGenerateModal;