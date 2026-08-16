import TaskCard from './TaskCard';

const KanbanColumn = ({ title, status, tasks, onDrop, onDragStart, onTaskClick, isOver, onDragOver }) => {
  const columnColors = {
    'To Do': 'bg-gray-50 border-gray-200',
    'In Progress': 'bg-blue-50 border-blue-200',
    'Done': 'bg-green-50 border-green-200'
  };

  return (
    <div
      className={`flex-1 min-w-[280px] rounded-xl border-2 p-4 transition-colors ${
        isOver ? 'border-blue-400 bg-blue-100' : columnColors[status]
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
        <h3 className="font-bold text-gray-800">{title}</h3>
        <span className="bg-white text-gray-600 text-xs font-medium px-2 py-1 rounded-full border">
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