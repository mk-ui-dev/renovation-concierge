import Header from '@/components/Header';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { notFound, redirect } from 'next/navigation';

export default async function ClientProjectDetailPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      milestones: {
        orderBy: { order: 'asc' },
      },
      defects: {
        orderBy: { reportedDate: 'desc' },
      },
      siteVisits: {
        orderBy: { visitDate: 'desc' },
        include: { inspector: true },
      },
      deliveries: {
        orderBy: { expectedDate: 'asc' },
      },
    },
  });

  if (!project || project.clientId !== user.id) {
    notFound();
  }

  const completedMilestones = project.milestones.filter((m) => m.status === 'completed').length;
  const progressPercent =
    project.milestones.length > 0
      ? Math.round((completedMilestones / project.milestones.length) * 100)
      : 0;

  return (
    <div>
      <Header title={project.name} description={project.address} />

      <div className="p-6">
        {/* Project Overview */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-700">Overall Progress</h3>
              <span className="text-sm font-bold text-gray-900">{progressPercent}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {project.description && (
            <p className="text-gray-700 mb-4">{project.description}</p>
          )}

          <div className="grid grid-cols-2 gap-4">
            {project.startDate && (
              <div>
                <span className="text-sm text-gray-600">Start Date:</span>
                <p className="font-medium text-gray-900">
                  {new Date(project.startDate).toLocaleDateString()}
                </p>
              </div>
            )}
            {project.endDate && (
              <div>
                <span className="text-sm text-gray-600">Expected Completion:</span>
                <p className="font-medium text-gray-900">
                  {new Date(project.endDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Milestones */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Project Timeline</h2>
          </div>
          <div className="p-6">
            {project.milestones.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No milestones defined</p>
            ) : (
              <div className="space-y-4">
                {project.milestones.map((milestone, idx) => (
                  <div key={milestone.id} className="flex items-start">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                          milestone.status === 'completed'
                            ? 'bg-green-500'
                            : milestone.status === 'in_progress'
                            ? 'bg-blue-500'
                            : 'bg-gray-300'
                        }`}
                      >
                        {milestone.status === 'completed' ? '✓' : idx + 1}
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{milestone.title}</h3>
                          {milestone.description && (
                            <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                          )}
                          <p className="text-sm text-gray-500 mt-2">
                            Due: {new Date(milestone.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded ${
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
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Defects */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Defects & Issues</h2>
            </div>
            <div className="p-6">
              {project.defects.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No defects reported</p>
              ) : (
                <div className="space-y-3">
                  {project.defects.map((defect) => (
                    <div key={defect.id} className="border border-gray-200 rounded p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-sm text-gray-900">{defect.title}</h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            defect.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : defect.status === 'fixed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}
                        >
                          {defect.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{defect.description}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Location: {defect.location} • Severity: {defect.severity}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Site Visits */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Site Inspections</h2>
            </div>
            <div className="p-6">
              {project.siteVisits.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No inspections recorded</p>
              ) : (
                <div className="space-y-3">
                  {project.siteVisits.map((visit) => (
                    <div key={visit.id} className="border border-gray-200 rounded p-3">
                      <p className="font-medium text-sm text-gray-900">
                        {new Date(visit.visitDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">By: {visit.inspector.name}</p>
                      {visit.notes && (
                        <p className="text-xs text-gray-700 mt-2">{visit.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
