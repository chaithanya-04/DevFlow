const TaskCard = ({ task, onDragStart, onClick }) => {
  const priorityColors = {
    High: 'border-l-red-500 bg-red-50 dark:bg-red-900/20',
    Medium: 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
    Low: 'border-l-green-500 bg-green-50 dark:bg-green-900/20'
  };

  const formatDate = (date) => {
    if (!date) return 'No deadline';
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task._id)}
      onClick={() => onClick(task)}
      className={`p-4 rounded-lg border border-gray-200 dark:border-gray-700 border-l-4 cursor-move hover:shadow-md transition-all mb-3 ${priorityColors[task.priority] || 'border-l-gray-500 bg-white dark:bg-gray-800'}`}
    >
      <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1 line-clamp-2">{task.title}</h4>
      
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
        <span className="flex items-center gap-1">
          <span className={`w-2 h-2 rounded-full ${
            task.difficulty === 'Hard' ? 'bg-red-400' :
            task.difficulty === 'Medium' ? 'bg-yellow-400' : 'bg-green-400'
          }`} />
          {task.difficulty}
        </span>
        <span>{formatDate(task.dueDate)}</span>
      </div>

      {task.assignedTo && (
        <div className="mt-2 flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center text-xs font-bold">
            {task.assignedTo.name?.charAt(0)}
          </div>
          <span className="text-xs text-gray-600 dark:text-gray-400 truncate">{task.assignedTo.name}</span>
        </div>
      )}

      {task.estimatedTime && (
        <span className="inline-block mt-2 text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
          {task.estimatedTime}
        </span>
      )}
    </div>
  );
};

export default TaskCard;