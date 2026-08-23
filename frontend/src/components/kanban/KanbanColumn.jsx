import TaskCard from './TaskCard';

const KanbanColumn = ({ title, status, tasks, onDrop, onDragStart, onTaskClick, isOver, onDragOver }) => {
  const columnColors = {
    'To Do': 'bg-gray-50 border-gray-200 dark:bg-gray-900 dark:border-gray-700',
    'In Progress': 'bg-blue-50 border-blue-200 dark:bg-blue-900/20',
    'Done': 'bg-green-50 border-green-200 dark:bg-green-900/20'
  };

  return (
    <div
      className={`flex-1 min-w-[280px] rounded-xl border-2 p-4 transition-colors ${
        isOver ? 'border-blue-400 bg-blue-100 dark:bg-blue-900/30' : columnColors[status]
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(status);
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDrop(e, status);
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800 dark:text-gray-200">{title}</h3>
        <span className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium px-2 py-1 rounded-full border dark:border-gray-700">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-2 min-h-[100px]">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onDragStart={onDragStart}
            onClick={onTaskClick}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;