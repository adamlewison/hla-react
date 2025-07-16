import { useEffect, useState } from 'react';
import { getProjects } from './api';

export default () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await getProjects();
        setProjects(data);
        setError(null);
      } catch (err) {
        console.error('Error in test component:', err);
        setError('Failed to load projects. Check console for details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <div className="p-8">Loading projects...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Projects Test</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div key={project.id} className="border rounded-lg overflow-hidden shadow-md">
            <div className="h-48 bg-gray-200 overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
              <p className="text-gray-600 mb-2">{project.category}</p>
              <p className="text-sm text-gray-500">Year: {project.year}</p>
              {project.location && (
                <p className="text-sm text-gray-500">Location: {project.location}</p>
              )}
              <p className="mt-2 text-sm">
                {project.description?.substring(0, 100)}...
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-2">Raw Data:</h2>
        <pre className="text-xs bg-white p-4 rounded overflow-auto max-h-96">
          {JSON.stringify(projects, null, 2)}
        </pre>
      </div>
    </div>
  );
};
