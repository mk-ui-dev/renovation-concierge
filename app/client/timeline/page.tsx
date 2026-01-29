import Header from '@/components/Header';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';

export default async function ClientTimelinePage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const projects = await prisma.project.findMany({
    where: {
      clientId: user.id,
      status: { in: ['in_progress', 'planned'] },
    },
    include: {
      milestones: {
        orderBy: { dueDate: 'asc' },
      },
    },
    orderBy: { startDate: 'asc' },
  });

  return (
    <div>
      <Header title="Timeline" description="Your project schedule and milestones" />

      <div className="p-6">
        {projects.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500">No active projects</p>
          </div>
        ) : (
          <div className="space-y-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">{project.name}</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {project.startDate && `Start: ${new Date(project.startDate).toLocaleDateString()}`}
                    {project.endDate && ` • End: ${new Date(project.endDate).toLocaleDateString()}`}
                  </p>
                </div>

                <div className="p-6">
                  {project.milestones.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No milestones defined</p>
                  ) : (
                    <div className="space-y-4">
                      {project.milestones.map((milestone) => (
                        <div
                          key={milestone.id}
                          className={`border-l-4 pl-4 py-2 ${
                            milestone.status === 'completed'
                              ? 'border-green-500'
                              : milestone.status === 'in_progress'
                              ? 'border-blue-500'
                              : 'border-gray-300'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-gray-900">{milestone.title}</h3>
                              {milestone.description && (
                                <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                              )}
                              <p className="text-sm text-gray-500 mt-1">
                                Due: {new Date(milestone.dueDate).toLocaleDateString()}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded ${
                                milestone.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : milestone.status === 'in_progress'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {milestone.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
