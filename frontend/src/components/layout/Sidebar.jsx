const Sidebar = () => {
  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-8">
        DevFlow
      </h1>

      <nav className="space-y-3">
        <a href="/" className="block hover:text-gray-300">
          Dashboard
        </a>

        <a href="/projects" className="block hover:text-gray-300">
          Projects
        </a>

        <a href="/tasks" className="block hover:text-gray-300">
          Tasks
        </a>

        <a href="/kanban" className="block hover:text-gray-300">
          Kanban
        </a>
      </nav>
    </aside>
  );
};

export default Sidebar;