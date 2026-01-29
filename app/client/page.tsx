import Header from '@/components/Header';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import Link from 'next/link';

export default async function ClientDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const projects = await prisma.project.findMany({
    where: { clientId: user.id },
    include: {
      milestones: {
        orderBy: { order: 'asc' },
      },
      _count: {
        select: {
          defects: true,
          siteVisits: true,
          deliveries: true,
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return (
    <div>
      <Header title="My Renovation Projects" description="Track your renovation progress" />

      <div className="p-6">
        {projects.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500">No projects assigned yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {projects.map((project) => {
              const completedMilestones = project.milestones.filter(
                (m) => m.status === 'completed'
              ).length;
              const progressPercent =
                project.milestones.length > 0
                  ? Math.round((completedMilestones / project.milestones.length) * 100)
                  : 0;

              return (
                <div key={project.id} className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">{project.name}</h2>
                        <p className="text-sm text-gray-600 mt-1">{project.address}</p>
                        {project.description && (
                          <p className="text-sm text-gray-700 mt-2">{project.description}</p>
                        )}
                      </div>
                      <span
                        className={`px-3 py-1 text-sm font-medium rounded ${
                          project.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : project.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {project.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                        <span className="text-sm font-bold text-gray-900">{progressPercent}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-blue-600 h-3 rounded-full transition-all"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Project Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 bg-gray-50 rounded">
                        <div className="text-2xl font-bold text-gray-900">
                          {project.milestones.length}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">Milestones</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded">
                        <div className="text-2xl font-bold text-gray-900">
                          {project._count.siteVisits}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">Site Visits</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded">
                        <div className="text-2xl font-bold text-gray-900">
                          {project._count.defects}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">Defects</div>
                      </div>
                    </div>

                    {/* Recent Milestones */}
                    {project.milestones.length > 0 && (
                      <div>
                        <h3 className="font-medium text-gray-900 mb-3">Recent Milestones</h3>
                        <div className="space-y-2">
                          {project.milestones.slice(0, 3).map((milestone) => (
                            <div
                              key={milestone.id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded"
                            >
                              <div className="flex items-center">
                                <div
                                  className={`w-3 h-3 rounded-full mr-3 ${
                                    milestone.status === 'completed'
                                      ? 'bg-green-500'
                                      : milestone.status === 'in_progress'
                                      ? 'bg-blue-500'
                                      : 'bg-gray-300'
                                  }`}
                                />
                                <span className="text-sm text-gray-900">{milestone.title}</span>
                              </div>
                              <span className="text-xs text-gray-500">
                                {new Date(milestone.dueDate).toLocaleDateString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* View Details Link */}
                    <div className="mt-6">
                      <Link
                        href={`/client/projects/${project.id}`}
                        className="block text-center w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                      >
                        View Full Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
